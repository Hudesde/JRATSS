#!/usr/bin/awk -f

# Script AWK para analizar logs y extraer estadísticas
# Uso: cat logfile.log | awk -f analyze_logs.awk

BEGIN {
    print "📊 Analizando logs..."
    print "===================="
    errors = 0
    warnings = 0
    info = 0
    total = 0
}

# Contar errores
/ERROR|error|Error/ {
    errors++
    error_lines[errors] = $0
}

# Contar warnings
/WARNING|warning|Warning|WARN/ {
    warnings++
}

# Contar info
/INFO|info|Info/ {
    info++
}

# Todas las líneas
{
    total++
    
    # Extraer timestamps si existen (formato común: [2024-10-27 12:34:56])
    if (match($0, /\[([0-9]{4}-[0-9]{2}-[0-9]{2})\]/, arr)) {
        dates[arr[1]]++
    }
}

END {
    print "\n📈 Resumen:"
    print "  Total de líneas:", total
    print "  Errores:        ", errors, sprintf("(%.1f%%)", (errors/total)*100)
    print "  Warnings:       ", warnings, sprintf("(%.1f%%)", (warnings/total)*100)
    print "  Info:           ", info, sprintf("(%.1f%%)", (info/total)*100)
    
    if (errors > 0) {
        print "\n🔴 Últimos 5 errores:"
        start = (errors > 5) ? errors - 4 : 1
        for (i = start; i <= errors; i++) {
            print "  ", i ".", substr(error_lines[i], 1, 80)
        }
    }
    
    if (length(dates) > 0) {
        print "\n📅 Actividad por fecha:"
        for (date in dates) {
            print "  ", date ":", dates[date], "entradas"
        }
    }
}
