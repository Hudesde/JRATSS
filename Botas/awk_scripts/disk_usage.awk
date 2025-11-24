#!/usr/bin/awk -f

# Script AWK para analizar uso de espacio en directorios
# Uso: du -a /ruta | awk -f disk_usage.awk

BEGIN {
    print "💾 Análisis de uso de disco"
    print "============================"
    total_size = 0
    file_count = 0
}

{
    size = $1
    path = $2
    
    total_size += size
    file_count++
    
    # Guardar tamaño por ruta
    sizes[path] = size
    
    # Detectar extensiones
    if (match(path, /\.([a-zA-Z0-9]+)$/, arr)) {
        ext = arr[1]
        ext_sizes[ext] += size
        ext_counts[ext]++
    }
}

END {
    print "\n📊 Estadísticas generales:"
    print "  Total de archivos/dirs:", file_count
    print "  Espacio total:         ", human_size(total_size)
    
    if (length(ext_sizes) > 0) {
        print "\n📁 Espacio por tipo de archivo:"
        
        # Ordenar por tamaño (simulado con array auxiliar)
        for (ext in ext_sizes) {
            sorted[ext] = ext_sizes[ext]
        }
        
        # Mostrar top 10
        n = 0
        for (ext in sorted) {
            if (n++ >= 10) break
            percentage = (sorted[ext] / total_size) * 100
            printf "  .%-8s %10s (%5.1f%%) - %d archivos\n", \
                   ext, human_size(sorted[ext]), percentage, ext_counts[ext]
        }
    }
}

function human_size(bytes) {
    units = "B KB MB GB TB"
    split(units, u, " ")
    unit = 1
    
    while (bytes >= 1024 && unit < 5) {
        bytes /= 1024
        unit++
    }
    
    return sprintf("%.2f %s", bytes, u[unit])
}
