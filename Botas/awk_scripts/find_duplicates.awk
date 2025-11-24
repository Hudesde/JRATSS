#!/usr/bin/awk -f

# Script AWK para encontrar archivos duplicados por nombre
# Uso: find /ruta -type f | awk -f find_duplicates.awk

BEGIN {
    print "🔍 Buscando archivos duplicados por nombre..."
    print "================================================"
}

{
    # Obtener solo el nombre del archivo (sin ruta)
    split($0, parts, "/")
    filename = parts[length(parts)]
    
    # Almacenar la ruta completa indexada por nombre
    if (filename in files) {
        # Es un duplicado
        if (!(filename in duplicates)) {
            # Primera vez que encontramos duplicado
            duplicates[filename] = files[filename]
        }
        # Agregar esta ocurrencia
        duplicates[filename] = duplicates[filename] "\n  " $0
    } else {
        # Primera ocurrencia de este nombre
        files[filename] = "  " $0
    }
}

END {
    if (length(duplicates) == 0) {
        print "\n✓ No se encontraron duplicados"
    } else {
        print "\n⚠️  Archivos duplicados encontrados:\n"
        
        for (filename in duplicates) {
            print "📄 " filename " (múltiples ubicaciones):"
            print duplicates[filename]
            print ""
        }
        
        print "Total de archivos con duplicados:", length(duplicates)
    }
}
