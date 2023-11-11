## Deployment
This directory holds the Kubernetes manifests for deployment to a Kubernetes cluster.

### Local K8s Cluster Setup
#### Prerequisites
1. Ensure [minikube](https://minikube.sigs.k8s.io/docs/start/), [helm](https://helm.sh/) and [kustomize](https://kustomize.io/) are installed on your local machine.
1. Ensure PostgreSQL, MongoDB and Redis are installed on your local machine. Start these services.

#### Setup minikube and build Docker containers
1. Start minikube (e.g. `minikube start`).
1. Run `eval $(minikube docker-env)` to set the environment .variables for the Docker daemon to run inside the Minikube cluster.
1. In the same terminal, build the docker images locally (e.g. `docker compose build`). 
    > The **teaching team** can skip this step while deploying locally - the images will be pulled automatically when running the steps under the `Deploy microservices` section below

#### Install ingress-nginx
1. Install ingress-nginx via Helm on the minikube cluster.
    <!-- Installing directly from Helm to install ingress-nginx into a separate namespace 'nginx'. We cannot specify custom namespaces under 'dependencies' of our custom Helm chart -->
    - Add the ingress-nginx repo to Helm via `helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`
    - `helm repo update`
    - Install ingress-nginx and create the `nginx` namespace via `helm install nginx-ingress ingress-nginx/ingress-nginx --namespace nginx --create-namespace`

#### Install Istio
1. (Helm) Install Istio via Helm on the minikube cluster.
    - Add the Istio repo to Helm via `helm repo add istio https://istio-release.storage.googleapis.com/charts`
    - `helm repo update`
    - `helm install istio-base istio/base -n istio-system --create-namespace --set defaultRevision=default`
    - `helm install istiod istio/istiod -n istio-system --wait`
    - `helm ls -n istio-system` (verify both charts have been successfully deployed)
    - `kubectl label namespace default istio-injection=enabled --overwrite` (enable [automatic sidecar injection](https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/))
        - Run `kubectl get namespace -L istio-injection` to verify label has been set correctly
1. (Istioctl) Alternatively, install via istioctl (e.g. `brew install istioctl`)
    - `istioctl install --set profile=minimal`
    - `kubectl label namespace default istio-injection=enabled --overwrite` (enable [automatic sidecar injection](https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/))
    - To uninstall, run `istioctl uninstall --purge`

<!-- #### Install RabbitMQ
1. Install RabbitMQ via Helm on the minikube cluster.
    - Add the RabbitMQ repo to Helm via `helm repo add bitnami https://charts.bitnami.com/bitnami`
    - `helm repo update`
    - Install RabbitMQ and create the `rmq` namespace via `helm install rmq bitnami/rabbitmq -n rmq --create-namespace`
    - Take note of the password to the RabbitMQ instance (e.g. `echo "Password: $(kubectl get secret --namespace rmq rmq-rabbitmq -o jsonpath="{.data.rabbitmq-password}" | base64 -d)"`) We will set this later on in our `.env` file -->

<!-- ### Install Redis for Matching service -->
<!-- TODO: fill up details for setting up theses services for deployment -->

#### Configuring TLS Certificate
1. Navigate into the `deployment/backend` directory (e.g. `cd deployment/backend`).
1. Create your own Certificate and Private Key either with Let's Encrypt(https://letsencrypt.org/getting-started/) or with OpenSSl (following the steps below):
    - Create two files, `private_key.key` and `certificate.crt`.
    - Run `openssl genpkey -algorithm RSA -out private_key.key` to generate a private key.
    - Then run `openssl req -new -key private-key.pem -out CSR.csr` to generate a certificate signing request.
    - Then run `openssl x509 -req -in CSR.csr -signkey private_key.key -out certificate.crt` to generate a certificate.
1. Run `kubectl create secret tls my-tls-secret --key private_key.key --cert certificate.crt` to create a Kubernetes Secret that contains the TLS certificate and private key.
    - The actual secret can be retrieved using `kubectl get secret`.
1. Ensure the Ingress configuration matches that in `ingress.yaml`, specially the `secretName`.

#### Deploy microservices
1. Navigate into the `deployment/backend` directory (e.g. `cd deployment/backend`).
1. Copy `custom-values.example.yaml` as `custom-values.yaml` and set the corresponding variables.
1. Run `helm dependency update` to install the local `base-xxx` Helm charts.
1. Run `helm template peerprep-backend . --values ./values.yaml --values ./custom-values.yaml > ./base/backend.yaml` to generate the Helm templated K8s manifest.
    > For the following steps below, replace the `dev` in the filepaths with `prod` for deployment to production. The **teaching team** is to use `prod` if they do not wish to build the Docker images locally - the images will be automatically pulled from DockerHub
1. Copy and set the backend `.env` file in the `deployment/backend/overlays/dev` directory.
    - **IMPT NOTE (microservice hosts)**: Set all `{MICROSERVICE}_SERVICE_HOST` to `{microservice}.default.svc.cluster.local` (e.g. `QUESTION_SERVICE_HOST=question.default.svc.cluster.local`) and `{MICROSERVICE}_SERVICE_PORT` to the corresponding port specified in `values.yaml` inside the copied `.env` file.
    - **IMPT NOTE (database hosts)**: Set all the `{MICROSERVICE}_SERVICE_SQL_DATABASE_HOST` to `peer-prep-external-postgres-service.default.svc`, and all the `{MICROSERVICE}_SERVICE_MONGODB_URL` to `mongodb://peer-prep-external-mongodb-service.default.svc:27017/{database_name}`.
    - **IMPT NOTE (Google OAuth)**: Set `OAUTH_GOOGLE_REDIRECT_URL=http://localhost/v1/auth/google/redirect`.
    <!-- - **IMPT NOTE (RMQ)**: Set `RMQ_URL=amqp://user:${PASSWORD}@rmq-rabbitmq.rmq.svc.cluster.local:5672`, where `${PASSWORD}` is to be replaced by the password obtained from the RabbitMQ installation step above. -->
1. Run `kustomize build overlays/dev` to check that kustomize has been configured correctly, and can successfully override the values from the K8s manifest generated above by Helm.
    - The updated K8s manifest will be printed to the terminal if successful.
1. Run `kustomize build overlays/dev | kubectl apply -f -` to apply the kustomized K8s manifest file in the minikube cluster and deploy our microservices

#### Connecting to ingress from localhost
1. Run `minikube tunnel` to connect to the nginx LoadBalancer service
1. Access the nginx server via `http://localhost`
<!-- 1. To access the API gateway from localhost, run `kubectl port-forward deployment/http-gateway 4000:4000`. This is a temporary workaround until the ingress is properly configured. -->

### Pushing Docker images
1. Run `docker compose build` to build the latest images.
1. Login to DockerHub via `docker login`.
1. Push the images to DockerHub via `docker compose push`.

### Deployment Architecture Diagram
![Deployment Architecture Diagram](deployment_architecture.png)
