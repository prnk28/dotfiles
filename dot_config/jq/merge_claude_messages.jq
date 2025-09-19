# Merge all messages by session ID without type filtering
# Usage: jq -s -f merge_text_messages.jq input.json

# Process all JSON objects
map(select(.messages))
# Sort by timestamp first
| sort_by(.timestamp)
# Group by session ID
| group_by(.id)
# Create final structure for each session
| map({
    messages: map({
      from: .from,
      type: (
        if .messages | type == "array" then
          .messages[0].type // null
        else
          "text"
        end
      ),
      content: (
        if .messages | type == "array" then
          .messages[0] | (
            .text // 
            .content // 
            .input // 
            {
              tool_use_id: .tool_use_id,
              name: .name,
              input: .input
            } //
            .
          )
        else
          .messages
        end
      ),
      timestamp: .timestamp
    }),
    lastAccessed: .[-1].timestamp,
    totalMessages: length,
    cwd: .[0].dir,
    id: .[0].id
  })
