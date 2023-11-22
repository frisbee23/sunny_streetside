. **DXF (Drawing Exchange Format):**
    
1. DXF is a file format developed by Autodesk for representing 2D and 3D drawings. It's often used for CAD (Computer-Aided Design) data.
    - Software for viewing and editing DXF files:
        - LibreCAD: An open-source CAD application that supports DXF files.
        - FreeCAD: A parametric 3D CAD modeler that can import and export DXF files.
2. **SHP (Shapefile):**
    
    - SHP is a popular geospatial vector data format developed by Esri. It consists of multiple files, including a main file (.shp) that contains geometric data.
    - Software for viewing and analyzing SHP files:
        - QGIS (Quantum GIS): A powerful open-source GIS application that supports a wide range of geospatial formats, including SHP.
        - GDAL (Geospatial Data Abstraction Library): A library for reading and writing raster and vector geospatial data. It includes command-line tools for working with SHP files.
3. **GPKG (GeoPackage):**
    
    - GPKG is an open standard for geospatial data interchange, supporting both vector and raster data. It is a single SQLite database file with a defined schema.
    - Software for viewing and analyzing GPKG files:
        - QGIS: QGIS also supports GeoPackage and can be used to view and analyze the data within these files.
        - Spatialite: A lightweight spatial extension for SQLite that can handle GeoPackage files.

**Programmatic Analysis:**

- For programmatic analysis of geospatial data in these formats, you can use Python with libraries such as GeoPandas (for SHP), Fiona (for SHP), and SQLite for GeoPackage. GDAL/OGR is also a powerful library for working with a variety of geospatial formats, including SHP and GPKG.