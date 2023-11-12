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

#### Configuring TLS Certificate (for `prod` directory build only)
> The teaching team should ignore this step when running a `dev` build.
1. Install `cert-manager`.
    1. Referenced from [here](https://cert-manager.io/docs/installation/helm/)
    1. Navigate into the `deployment/backend` directory (e.g. `cd deployment/backend`).
    1. `helm repo add jetstack https://charts.jetstack.io`
    1. `helm repo update`
    1. `kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.crds.yaml`
    1. `helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.13.2`
1. Configure a static IP address for the cluster ingress (e.g. on GKE, refer [here](https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer#optional_configuring_a_static_ip_address
)).
1. Register a domain name that points to the deployed k8s cluster ingress.
1. Run the k8s manifests in the section below on Deploy microservices.

#### Deploy microservices
1. Navigate into the `deployment/backend` directory (e.g. `cd deployment/backend`).
1. Copy `custom-values.example.yaml` as `custom-values.yaml` and set the corresponding variables.
    1. For `prod` deployments, set the ingress `hostName` to the domain gotten from the previous section on TLS certificates.
1. Run `helm dependency update` to install the local `base-xxx` Helm charts.
1. Run `helm template peerprep-backend . --values ./values.yaml --values ./custom-values.yaml > ./base/backend.yaml` to generate the Helm templated K8s manifest.
    > For the following steps below, replace the `dev` in the **filepaths** with `prod` for deployment to production. The **teaching team** should use `dev` and build their own Docker images as outlined above.
1. Copy and set the backend `.env` file in the `deployment/backend/overlays/dev` directory.
    - **IMPT NOTE (microservice hosts)**: Set all `{MICROSERVICE}_SERVICE_HOST` to `{microservice}.default.svc.cluster.local` (e.g. `QUESTION_SERVICE_HOST=question.default.svc.cluster.local`) and `{MICROSERVICE}_SERVICE_PORT` to the corresponding port specified in `values.yaml` inside the copied `.env` file.
    - **IMPT NOTE (database hosts)**: Set
        - All the `{MICROSERVICE}_SERVICE_SQL_DATABASE_HOST` to `peer-prep-external-postgres-service.default.svc`
        - All the `{MICROSERVICE}_SERVICE_MONGODB_URL` to `mongodb://peer-prep-external-mongodb-service.default.svc:27017/{database_name}`
        - `REDIS_HOST` to `peer-prep-external-redis-service.default.svc`.
        > For `prod` builds, these steps can be ignored if you are able to specify the private VPC IP to the above services in the `.env` file itself.
    - **IMPT NOTE (Google OAuth)**: Set `OAUTH_GOOGLE_REDIRECT_URL=http://localhost/v1/auth/google/redirect` (modify URL for `prod` accordingly).
1. Run `kustomize build overlays/dev` to check that kustomize has been configured correctly, and can successfully override the values from the K8s manifest generated above by Helm.
    - The updated K8s manifest will be printed to the terminal if successful.
1. Run `kustomize build overlays/dev | kubectl apply -f -` to apply the kustomized K8s manifest file in the minikube cluster and deploy our microservices

#### Connecting to ingress from localhost
1. Run `minikube tunnel` to connect to the nginx LoadBalancer service
1. Access the nginx server via `http://localhost`
<!-- 1. To access the API gateway from localhost, run `kubectl port-forward deployment/http-gateway 4000:4000`. This is a temporary workaround until the ingress is properly configured. -->

### Pushing Docker images (for production release)
1. Run `docker compose build` to build the latest images. (should be building on platform `linux/amd64` for production deployments)
1. Login to DockerHub via `docker login`.
1. Push the images to DockerHub via `docker compose push`.
1. Alternatively, a GitHub Action has been configured to build and push to the remote DockerHub repository on push to `master`.

### Deployment Architecture Diagram
![Deployment Architecture Diagram](deployment_architecture.png)
