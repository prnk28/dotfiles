# Track working directory changes for shared CWD functionality
# This allows all terminal apps to open in the same directory

# Function to update shared CWD
_update_shared_cwd() {
    if command -v set-shared-cwd &>/dev/null; then
        set-shared-cwd "$PWD" 2>/dev/null
    fi
}

# Hook into directory changes
autoload -U add-zsh-hook
add-zsh-hook chpwd _update_shared_cwd

# Set initial CWD on shell startup
_update_shared_cwd