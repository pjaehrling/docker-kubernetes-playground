# AWS

![Maybe you should quit?](https://media.giphy.com/media/3o6Mb4mtibHyCfBT8I/giphy.gif)

## Amazon Elastic Container Service for Kubernetes (Amazon EKS) 
- Deploy, manage, and scale containerized applications using Kubernetes on AWS
- Runs the Kubernetes management infrastructure for you across multiple AWS availability zones to eliminate a single point of failure
- It's possible to run Kubernetes on AWS without utilizing EKS though ([example](https://github.com/zalando-incubator/kubernetes-on-aws))
- Alternative to AWS-CLI to create Kubernetes clusters on AWS (not just there) is to use: [kops](https://github.com/kubernetes/kops)
  - Kubernetes cluster created using kops already has two IAM roles
    1. master IAM role: EC2, Elastic Load Balancer (ELB), EC2 Container Registry (ECR), Route53, and Key Management Service (KMS)
    2. worker EC2, ECR, and Route53 
  - possible to add additional policies to those IAM roles, by changing the cluster spec ([see](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/04-path-security-and-networking/402-authentication-and-authorization#iam-roles-for-master-nodes))
- Another Way to provide IAM roles for pods: [kube2iam](https://github.com/jtblin/kube2iam)

### Commands
- Basic infos: `aws eks help`

#### Create a cluster
- `aws eks create-cluster --name <name> --role-arn <arn:aws:iam::...:role/...>  --resources-vpc-config subnetIds=<subnet-...,subnet-...>,securityGroupIds=<sg-...>`
- OR use [eksctl](https://eksctl.io/): `eksctl get cluster --name=<name> --region=<region> --nodes=<nodes> --node-type=<type>`
  - all of the listed parameters are optional
  - default: auto-generated name and 2x `m5.large` instances with a dedicated VPC in `us-west-2`
- List clusters: `aws eks list-clusters`
- Make sure `kubectl` uses the created cluster (change `~/.kube/config`, take a look at [this template](aws-kube-config-template.yml))
- `kubectl get service` should list the new cluster
- create nodes / a cloudformation stack / node group ... that's a whole new story: [example template](aws-eks-cloudformation-stack-template.yaml)
  - `aws cloudformation create-stack --stack-name <name> --template-url <yml-in-S3-bucket> ...`
- make sure the nodes can join the cluster by adding a authentication config map to the cluster
  - [example](aws-auth-configmap.yaml)
  - `kubectl apply -f aws-auth-configmap.yaml`

## General Infos

### AWS User & Permission System
#### AWS Account Root User
- Has complete, unrestricted access to all resources in that AWS account (billing infos, etc. )
- No way of restricing those permissions/policies (so don't use in everyday work)
          
#### IAM User
- Represents a person or service (login possibility)
- Consists of a name, password and up to two access keys (API & CLI)
- Grant it permissions by making it a member of a group (recommended), or by directly attaching policies to the user
               
#### IAM Group
- Collection of IAM users (easier to manage permissions)
- Grant it permissions by attaching policies
               
#### IAM Role
- Similar to a user (identity with permission), intended to be assumable by anyone who needs it
- BUT a role does not have any credentials (password or access keys)
- BUT could get temporary credentials

#### Standalone policy
- Define/provide permissions
- Is an entity in IAM and has its own Amazon Resource Name (ARN)
- Can be used for different principal entities (a user, group, or role) and in multiple accounts
                           
#### Inline Policies
- Is embedded in a principal entity (a user, group, or role)
- one-to-one relationship between a policy and the principal entity
                                                     
#### AWS Managed Policy
- Standalone policy that is created and administered by AWS, to provide permissions for many common use cases
- For example: `AmazonDynamoDBFullAccess`, `IAMFullAccess`, `AWSKeyManagementServicePowerUser`, `AmazonEC2ReadOnlyAccess`, ...

![AWS Managed Policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/images/policies-aws-managed-policies.diagram.png)
source: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html

#### Customer Managed Policy
- Standalone policies that you manage in your own AWS account

![Customer Managed Policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/images/policies-customer-managed-policies.diagram.png)
source: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.htmldocs