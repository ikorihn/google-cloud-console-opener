# Google Cloud Console Opener

## Install

### 1. Clone this repository.

### 2. Install dependencies.

```shell
$ pnpm install
```

### 3. Build extension.

```shell
$ npm run dev
```

### 4. Configure project IDs.

When using this command for the first time, set up a comma-separated list of project IDs in the extension settings.

### 5. Configure gcloud path (optional).

The Logging query builder lists Cloud Run services, jobs, and worker pools with the gcloud CLI.
Raycast does not inherit your shell `PATH`, so set the absolute path of `gcloud` (output of `which gcloud`) in the extension settings.
