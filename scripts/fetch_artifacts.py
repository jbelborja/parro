import subprocess
import json
import yaml
import os

REPOS = [
    "jbelborja/multiply-tables-app",
    "jbelborja/english-verbs-app"
]

def get_latest_artifacts_for_repo(repo):
    print(f"Fetching artifacts for {repo}...")
    try:
        # Get all workflows to find successful runs from any of them
        runs_cmd = [
            "gh", "run", "list",
            "--repo", repo,
            "--limit", "10",
            "--json", "databaseId,name,status,conclusion,workflowDatabaseId"
        ]
        result = subprocess.run(runs_cmd, capture_output=True, text=True, check=True, env=os.environ.copy())
        runs = json.loads(result.stdout)
        
        # Group by workflow to get latest successful for each
        latest_runs = {}
        for r in runs:
            wid = r["workflowDatabaseId"]
            if r["conclusion"] == "success" and wid not in latest_runs:
                latest_runs[wid] = r
        
        all_artifacts = []
        for run in latest_runs.values():
            run_id = run["databaseId"]
            api_cmd = [
                "gh", "api",
                f"repos/{repo}/actions/runs/{run_id}/artifacts"
            ]
            res = subprocess.run(api_cmd, capture_output=True, text=True, check=True, env=os.environ.copy())
            artifacts_data = json.loads(res.stdout)
            
            for art in artifacts_data.get("artifacts", []):
                if not art.get("expired"):
                    all_artifacts.append({
                        "name": art["name"],
                        "url": f"https://github.com/{repo}/actions/runs/{run_id}/artifacts/{art['id']}",
                        "size": art["size_in_bytes"],
                        "created_at": art["created_at"]
                    })
        return all_artifacts
    except subprocess.CalledProcessError as e:
        print(f"Error fetching artifacts for {repo}: {e}")
        print(f"Stderr: {e.stderr}")
        return []
    except Exception as e:
        print(f"Unexpected error for {repo}: {e}")
        return []

def main():
    all_data = {}
    for repo in REPOS:
        repo_name = repo.split("/")[-1]
        artifacts = get_latest_artifacts_for_repo(repo)
        if artifacts:
            all_data[repo_name] = artifacts

    os.makedirs("data", exist_ok=True)
    with open("data/artifacts.yaml", "w") as f:
        yaml.dump(all_data, f)
    print("Artifacts saved to data/artifacts.yaml")

if __name__ == "__main__":
    main()
