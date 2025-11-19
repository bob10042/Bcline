import random

header = """#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// ==========================================
// MEGA SCRIPT - 1000+ Lines Actual
// ==========================================

#define MAX_BUFFER_SIZE 4096
#define MAX_ENTITIES 1000
#define DEBUG_MODE 1

void sys_log(const char *msg) {
    printf("[LOG] %s\\n", msg);
}

// ------------------------------------------
// GENERATED CONTENT START
// ------------------------------------------
"""

footer = """
// ------------------------------------------
// GENERATED CONTENT END
// ------------------------------------------

int main() {
    printf("System Start\\n");
    // Call some functions to avoid unused warnings
    sys_log("Running...");
    printf("System End\\n");
    return 0;
}
"""

with open("code_diff_tests/mega_script.c", "w") as f:
    f.write(header)
    
    # Generate 1000 lines of functions
    for i in range(200):
        f.write(f"void process_chunk_{i:03d}(int val) {{\n")
        f.write(f"    int temp = val * {i};\n")
        f.write(f"    if (temp > 1000) sys_log(\"Overflow in chunk {i:03d}\");\n")
        f.write(f"    else sys_log(\"Chunk {i:03d} OK\");\n")
        f.write("}\n\n")
    
    # Generate a huge switch statement
    f.write("void huge_switch(int code) {\n")
    f.write("    switch(code) {\n")
    for i in range(500):
        f.write(f"        case {i}: sys_log(\"Code {i}\"); break;\n")
    f.write("        default: sys_log(\"Unknown\"); break;\n")
    f.write("    }\n")
    f.write("}\n")

    f.write(footer)

print("Huge script generated.")
