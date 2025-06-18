#!/bin/bash

# Script to notify pull request author about test results
# This script should be called from GitHub Actions

set -e

# Check if we're in a pull request context
if [ -z "$GITHUB_EVENT_NAME" ] || [ "$GITHUB_EVENT_NAME" != "pull_request" ]; then
    echo "Not in a pull request context, skipping notification"
    exit 0
fi

# Get pull request info from GitHub event
PR_NUMBER=$(jq -r '.number' "$GITHUB_EVENT_PATH")
REPO_OWNER=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f1)
REPO_NAME=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f2)
BRANCH_NAME="$GITHUB_HEAD_REF"
COMMIT_SHA="$GITHUB_SHA"
RUN_ID="$GITHUB_RUN_ID"
RUN_URL="$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID"

# Check if the test job failed using the environment variable
TEST_JOB_FAILED=false

if [ "$TEST_JOB_RESULT" = "failure" ]; then
    TEST_JOB_FAILED=true
fi

if [ "$TEST_JOB_FAILED" = true ]; then
    EMOJI="❌"
    STATUS="FAILED"
    MESSAGE="$EMOJI **Tests Failed** for pull request #$PR_NUMBER in $GITHUB_REPOSITORY

**Details:**
- Branch: \`$BRANCH_NAME\`
- Commit: \`$COMMIT_SHA\`
- Run ID: #$RUN_ID

**Next Steps:**
1. Check the [workflow logs]($RUN_URL) for detailed error information
2. Fix the failing tests locally
3. Push your changes to trigger a new workflow

**Common Issues:**
- Database connection problems
- Missing dependencies
- Test environment setup issues

Please address the failing tests before requesting a review.

More infos on : $MON_SUPER_LIEN"

    # Send notification via GitHub API
    if [ ! -z "$GITHUB_TOKEN" ]; then
        echo "Sending failure notification to pull request #$PR_NUMBER..."
        
        # Escape the message for JSON
        ESCAPED_MESSAGE=$(echo "$MESSAGE" | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
        
        # Send comment to pull request
        curl --request POST \
            --header "Authorization: token $GITHUB_TOKEN" \
            --header "Accept: application/vnd.github.v3+json" \
            --header "Content-Type: application/json" \
            --data "{\"body\":\"$ESCAPED_MESSAGE\"}" \
            "https://api.github.com/repos/$GITHUB_REPOSITORY/issues/$PR_NUMBER/comments" \
            --silent --show-error
        
        echo "Failure notification sent successfully!"
        exit 0
    else
        echo "GITHUB_TOKEN not available, skipping API notification"
        echo "Message that would be sent:"
        echo "$MESSAGE"
    fi
    
    # Log the failure status
    echo "Workflow status: $STATUS"
    exit 1
else
    echo "✅ All tests passed! No notification needed."
    exit 0
fi 