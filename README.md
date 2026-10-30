# AWS Cloud Engineering Portfolio

A personal portfolio website and deployment workflow for demonstrating foundational cloud engineering skills. The site is built with HTML and CSS, and the repository includes a GitHub Actions workflow configured to publish website files to Amazon S3 and invalidate the Amazon CloudFront cache.

## Project overview

The website introduces an aspiring AWS cloud engineer, describes current learning interests, and provides sections for skills, projects, and contact information. The project also documents its intended deployment architecture in [architecture.md](./architecture.md).

## Project objectives

- Build a portfolio website with HTML and CSS.
- Practice version control and a GitHub-based deployment workflow.
- Configure automated website publishing to Amazon S3.
- Use GitHub OIDC to obtain AWS credentials through an IAM role.
- Invalidate CloudFront's cache after deployment.
- Document the architecture and cloud engineering learning goals.

## AWS services

- **Amazon S3** stores the website files. The workflow syncs repository files to the configured portfolio bucket.
- **Amazon CloudFront** delivers the website and receives a cache invalidation after each deployment.
- **AWS IAM** provides the role assumed by GitHub Actions to authorize deployment operations.

## GitHub Actions CI/CD pipeline

The workflow is defined in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). It runs when code is pushed to the `main` branch and:

1. Checks out the repository.
2. Logs the repository, branch, and event for the run.
3. Configures AWS credentials by assuming the role identified by the `AWS_ROLE_ARN` repository secret, in the region specified by the `AWS_REGION` repository variable.
4. Syncs website files to the configured S3 bucket, excluding `.git` and `.github` and removing destination files that no longer exist in the source.
5. Requests a CloudFront invalidation for `/*` using the `CLOUDFRONT_DISTRIBUTION_ID` repository variable.

## GitHub OIDC authentication

The workflow requests the GitHub Actions OIDC identity token using the `id-token: write` permission and uses `aws-actions/configure-aws-credentials` to assume an AWS IAM role. This workflow configuration uses role-based authentication rather than defining AWS access keys in the workflow file.

The role ARN, AWS region, and CloudFront distribution ID are supplied through GitHub repository configuration. The role's AWS-side trust policy and permissions are not included in this repository.

## Architecture overview

The documented flow is:

**Developer → VS Code → Git → GitHub Repository → GitHub Actions → GitHub OIDC → AWS IAM Role → Amazon S3 Bucket → Amazon CloudFront → Website Visitor**

GitHub Actions deploys the website files to S3 and triggers a CloudFront cache invalidation. See [architecture.md](./architecture.md) for the Mermaid diagram and AWS service descriptions.

## Deployment process

Push changes to the `main` branch to trigger the workflow. Before deployment, the repository must have the configuration referenced by the workflow: the `AWS_ROLE_ARN` secret and `AWS_REGION` and `CLOUDFRONT_DISTRIBUTION_ID` variables. The workflow syncs the repository contents to its configured S3 bucket, then requests CloudFront to invalidate all paths.

The workflow targets the bucket `genus247-aws-portfolio-2026`. AWS-side configuration and deployment run results are not documented in this repository.

## Security considerations

- The workflow requests an OIDC token and assumes an IAM role; it does not place AWS access keys in the workflow file.
- The AWS role's trust policy should restrict which GitHub repository and branch can assume it. Its actual policy is outside the files in this repository.
- Grant the role only the S3 and CloudFront permissions required for this deployment.
- Store the role ARN as a GitHub Actions secret and keep the region and distribution ID in repository variables as referenced by the workflow.
- The S3 sync uses `--delete`, so files removed from the repository are also removed from the bucket.
- The deployment excludes `.git` and `.github` from the S3 sync.

## Skills demonstrated

- HTML and CSS website development.
- Git and GitHub repository workflow.
- GitHub Actions workflow configuration.
- AWS IAM role-based access and GitHub OIDC integration.
- Amazon S3 website file synchronization.
- Amazon CloudFront cache invalidation.
- Architecture documentation with Mermaid.
- Cloud security fundamentals, including permissions and credential handling.
