#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define REQ_INIT 0
#define REQ_PROCESS_HEADER 1
#define REQ_PROCESS_BODY 2
#define REQ_PROCESS_FOOTER 3
#define REQ_VALIDATE_CHECKSUM 4
#define REQ_UPDATE_DATABASE 5
#define REQ_SEND_ACK 6
#define REQ_CLEANUP 7
#define REQ_ERROR_HANDLE 8
#define REQ_LOG_METRICS 9

#define MAX_BUFFER 1024

// Forward declaration
void log_state_change(int old_state, int new_state);
#define MAX_USERS 100

typedef struct {
    int id;
    char name[50];
    int role;
    int active;
    long last_login;
} User;

typedef struct {
    int state;
    int processed_bytes;
    char buffer[MAX_BUFFER];
    int error_code;
    int retry_count;
    User *current_user;
} RequestContext;

void handle_error(RequestContext *ctx, const char *msg) {
    printf("[ERROR] %s (Code: %d)\n", msg, ctx->error_code);
    ctx->state = REQ_ERROR_HANDLE;
}

// Helper function for user validation
int validate_user_permission(User *u, int required_role) {
    if (!u) return 0;
    if (!u->active) return 0;
    if (u->role < required_role) return 0;
    return 1;
}

void process_request_init(RequestContext *ctx) {
    printf("Initializing request...\n");
    memset(ctx->buffer, 0, MAX_BUFFER);
    ctx->processed_bytes = 0;
    ctx->retry_count = 0;
    ctx->state = REQ_PROCESS_HEADER;
}

void process_header_data(RequestContext *ctx) {
    // Simulate header processing logic
    if (ctx->processed_bytes > 100) {
        // Header too long
        ctx->error_code = 400;
        handle_error(ctx, "Header too long");
        return;
    }
    printf("Processing header...\n");
    // In a real system, we would parse bytes here
    // ...
    // ambiguous comment block
    // checking integrity
    // done checking
    ctx->state = REQ_PROCESS_BODY;
}

void process_body_payload(RequestContext *ctx) {
    // Simulate body processing
    printf("Processing body...\n");
    // Check if we have enough data
    if (strlen(ctx->buffer) == 0) {
        printf("Waiting for more data...\n");
        return; 
    }
    
    // Complex logic block that looks similar to others
    int i;
    for(i = 0; i < 20; i++) {
        // processing chunk
        int temp = i * 2;
        if (temp > 15) {
             printf("Chunk %d is large\n", i);
        }
    }

    ctx->state = REQ_PROCESS_FOOTER;
}

void process_footer_section(RequestContext *ctx) {
    printf("Processing footer...\n");
    // Footer validation
    // ...
    // ambiguous comment block
    // checking integrity
    // done checking
    ctx->state = REQ_VALIDATE_CHECKSUM;
}

void request_state_machine(RequestContext *ctx) {
    switch(ctx->state) {
        case REQ_INIT:
            log_state_change(REQ_INIT, REQ_PROCESS_HEADER);
            process_request_init(ctx);
            break;

        case REQ_PROCESS_HEADER:
            // Header specific logic inline
            if (ctx->retry_count > 3) {
                 handle_error(ctx, "Header retry limit exceeded");
                 ctx->state = REQ_ERROR_HANDLE;
                 break;
            }
            process_header_data(ctx);
            break;

        case REQ_PROCESS_BODY:
            // Body specific logic inline
            // NOTE: This looks very similar to header logic above
            if (ctx->retry_count > 5) {
                 handle_error(ctx, "Too many retries in body");
                 break;
            }
            process_body_payload(ctx);
            break;

        case REQ_PROCESS_FOOTER:
            process_footer_section(ctx);
            break;

        case REQ_VALIDATE_CHECKSUM:
            printf("Validating checksum...\n");
            // Simulate checksum calc
            int checksum = 0;
            // ambiguous loop
            for(int k=0; k<5; k++) {
                checksum += k;
            }
            
            if (checksum > 0) { 
                ctx->state = REQ_UPDATE_DATABASE;
            } else {
                ctx->error_code = 500;
                ctx->state = REQ_ERROR_HANDLE;
            }
            break;

        case REQ_UPDATE_DATABASE:
            printf("Updating DB...\n");
            // DB logic
            // ambiguous loop
            for(int k=0; k<5; k++) {
                // processing db
            }
            ctx->state = REQ_SEND_ACK;
            break;

        case REQ_SEND_ACK:
            printf("Sending ACK.\n");
            ctx->state = REQ_CLEANUP;
            break;

        case REQ_CLEANUP:
            printf("Cleaning up request.\n");
            // Reset everything
            ctx->state = REQ_INIT; // Loop back or finish
            break;

        case REQ_ERROR_HANDLE:
            printf("Handling error state. Resetting...\n");
            ctx->state = REQ_INIT;
            ctx->error_code = 0;
            break;

        default:
            printf("Unknown state!\n");
            break;
    }
}

void log_state_change(int old_state, int new_state) {
    printf("[SYSTEM] State changed from %d to %d\n", old_state, new_state);
}

int main() {
    RequestContext ctx;
    User u = {1, "Admin", 99, 1, 0};
    ctx.current_user = &u;
    ctx.state = REQ_INIT;
    
    // Simulate a run
    for(int i=0; i<20; i++) {
        printf("--- Cycle %d ---\n", i);
        request_state_machine(&ctx);
    }

    return 0;
}
