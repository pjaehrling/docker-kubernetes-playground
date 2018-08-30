# (Node Express) Docker Kubernetes Playground

Nothing usefull here. Just a playground!

## Docker
### Commands
#### Deploy
- Build: `docker build -t <userame>/node-express-docker-kubernetes-playground .`
- Run: `docker run -p <local-port>:<exposed-container-port> -d <userame>/node-express-docker-kubernetes-playground`
- Stop; `docker stop <ContainerId>`

#### Dockerhub
- Login: `docker login -u="<username>" -p="<password>"`
- Push: `docker push <userame>/node-express-docker-kubernetes-playground`
- Pull: `docker pull <userame>/node-express-docker-kubernetes-playground`

#### Info
- See images: `docker images`
- See running containers: `docker ps`
- See output: `docker logs <container id>`
- Enter the container: `docker exec -it <container id> /bin/bash`

## Kubernetes
### Infos
- `Node`
  - Physical/virtual server instance (e.g. AWS EC2 instance), which runs 0 - N `pods`
  - Receives commands / pod specs (.yml or .json files) and is monitored via the `Kubelet` (process running on every node)
- `Pod`
  - 1 - N Containers sharing the same excecution enviorment, which allows  inter-process communication
  - Has a unique IP address in the cluster
  - Pods shouldn't be run without a `ReplicaSet` or `Deployment` (described later)
- `Master node` aka `API Server`
  - The node to interact with the cluster (starting, stopping, monitoring the nodes/pods)
- `Service`
  - Defines a set of pods and how to access them (discovering & exposing of pods)
  - Acts as the entry point to a set of pods
  - Types:
    - `ClusterIP`: exposed just inside the clusters
    - `NodePort`: exposed to the outside via `<NodeIP>:<NodePort>`
    - `LoadBalancer`: Exposes the service externally using a cloud provider’s load balancer via `<ClusterIP>:<Port>`
    - `ExternalName`: Maps the service to the contents of the `externalName` field (e.g. foo.bar.example.com)
- `ReplicaSet`
  - Ensures that a specified number of pod replicas are running at any given time
  - It's recommanded to use `Deployments` to manage those
- `Deployment`
  - Higher-level concept to manage `Pods` and `ReplicaSets`
  - Continuous delivery is not covered by default, instead the image (tag) has to be changed for every deploy [More Infos](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/)

### SetUp
- Running a kubernetes cluster on your local machine
  - [Minikube](https://github.com/kubernetes/minikube/releases)
  - OSX: `brew cast install minikube`
  - Provides only one `Node`
- CLI/Client to make requests to the Kubernetes API server / master node
  - [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
  - OSX: `brew install kubectl`

### Commands
#### Minikube
  - Start the cluster: `minikube start`
  - Get the cluster ip address: `minikube ip`
  - Get the cluster status: `minikube status`
  - Stop the cluster: `minikube stop`

#### Kubectl
  - Run a container with a given name as/in a pod (deployment): `kubectl run <name> --image=<imagename> --labels="<labels>" --port=<port>`
  - Running a spec file: `kubectl apply/create -f <filename>.yaml`
  - Get a list of running pods/deployments/services/...: `kubectl get <pods/deployments/services/...>`
  - Get pods/deployments/services/... infos: `kubectl describe <pods/deployments/services/...> <name>`
  - Delete a pods/deployments/services/...: `kubectl delete <pods/deployments/services/...> <name>`

##### Access pods/app
  - Forward a port: `kubectl port-forward <pod-name> <local-port>:<app-pod-port>`
  - OR write a service spec file and run it: `kubectl create -f <service-spec>`
  - BUT when running on minikube, no `EXTERNAL-IP` will be available, solution: `minikube service <service-name>` will open the browser with the exposed service

##### Dealing with credentials / private docker images
  - Creating a docker-hub secret to access private images: `kubectl create secret docker-registry <name-for-secret> --docker-server=https://index.docker.io/v1/ --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>`
  - List secrets: `kubectl get secret`
  - Delete a secret: `kubectl delete secret <name>`
