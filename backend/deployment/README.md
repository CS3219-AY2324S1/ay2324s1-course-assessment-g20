## Deployment
This directory holds the Kubernetes manifests for deployment to a Kubernetes cluster.

### Local K8s Cluster Setup
#### Prerequisites
1. Ensure [minikube](https://minikube.sigs.k8s.io/docs/start/), [helm](https://helm.sh/) and [kustomize](https://kustomize.io/) are installed on your local machine.

#### Setup minikube and build Docker containers
1. Start minikube (e.g. `minikube start`).
1. Run `eval $(minikube docker-env)` to set the environment .variables for the Docker daemon to run inside the Minikube cluster.
1. In the same terminal, build the docker images locally (e.g. `docker compose build`).

#### Install ingress-nginx
1. Install ingress-nginx via Helm on the minikube cluster.
    <!-- Installing directly from Helm to install ingress-nginx into a separate namespace 'nginx'. We cannot specify custom namespaces under 'dependencies' of our custom Helm chart -->
    - Add the ingress-nginx repo to Helm via `helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`
    - `helm repo update`
    - Install ingress-nginx and create the `nginx` namespace via `helm install nginx-ingress ingress-nginx/ingress-nginx --namespace nginx --create-namespace`

#### Install RabbitMQ
1. Install RabbitMQ via Helm on the minikube cluster.
    - Add the RabbitMQ repo to Helm via `helm repo add bitnami https://charts.bitnami.com/bitnami`
    - `helm repo update`
    - Install RabbitMQ and create the `rmq` namespace via `helm install rmq bitnami/rabbitmq -n rmq --create-namespace`
    - Take note of the password to the RabbitMQ instance (e.g. `echo "Password: $(kubectl get secret --namespace rmq rmq-rabbitmq -o jsonpath="{.data.rabbitmq-password}" | base64 -d)"`) We will set this later on in our `.env` file

### Install Redis for Matching service
<!-- TODO: fill up details for setting up theses services for deployment -->

#### Deploy microservices
1. Navigate into the `deployment/backend` directory (e.g. `cd deployment/backend`).
1. Run `helm dependency update` to install the local `base-microservice` Helm chart
1. Run `helm template peerprep-backend . > ./base/backend.yaml` to generate the Helm templated K8s manifest.
1. Copy and set the backend `.env` file in the `deployment/backend/overlays/dev` directory.
    - **IMPT NOTE**: Remove all `{microservice}_SERVICE_HOST` and `{microservice}_SERVICE_PORT` variables in the copied `.env` file.
    - **IMPT NOTE**: Set `OAUTH_GOOGLE_REDIRECT_URL=http://localhost/v1/auth/google/redirect`
    - **IMPT NOTE**: Set `RMQ_URL=amqp://user:${PASSWORD}@rmq-rabbitmq.rmq.svc.cluster.local:5672`, where `${PASSWORD}` is to be replaced by the password obtained from the RabbitMQ installation step above
1. Run `kustomize build overlays/dev` to check that kustomize has been configured correctly, and can successfully override the values from the K8s manifest generated above by Helm.
    - The updated K8s manifest will be printed to the terminal if successful.
1. Run `kustomize build overlays/dev | kubectl apply -f -` to apply the kustomized K8s manifest file in the minikube cluster and deploy our microservices

#### Connecting to ingress from localhost
1. Run `minikube tunnel` to connect to the nginx LoadBalancer service
1. Access the nginx server via `http://localhost`
<!-- 1. To access the API gateway from localhost, run `kubectl port-forward deployment/http-gateway 4000:4000`. This is a temporary workaround until the ingress is properly configured. -->

#### Deployment Architecture Diagram
![Deployment Architecture Diagram](deployment_architecture.png)
