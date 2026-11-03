document.addEventListener("DOMContentLoaded", async () => {
    try {
        const respuesta = await fetch("/api/estadisticas");
        if (!respuesta.ok) {
            console.error("Error al obtener datos estadísticos");
            return;
        }

        const data = await respuesta.json();

        Highcharts.chart("grafico-lineas", {
            chart: { type: "line" },
            title: { text: "Cantidad de Avistamientos por Día" },
            xAxis: {
                categories: data.lineas.fechas,
                title: { text: "Fecha" }
            },
            yAxis: {
                title: { text: "Cantidad" },
                allowDecimals: false
            },
            series: [{
                name: "Avistamientos",
                data: data.lineas.cantidades
            }]
        });

        Highcharts.chart("grafico-torta", {
            chart: { type: "pie" },
            title: { text: "Distribución por Tipo de Ave" },
            tooltip: {
                pointFormat: "{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)"
            },
            series: [{
                name: "Total",
                colorByPoint: true,
                data: data.torta
            }]
        });

        // 3. Gráfico de barras: Voluntarios por comuna
        Highcharts.chart("grafico-barras", {
            chart: { type: "column" },
            title: { text: "Voluntarios Registrados por Comuna" },
            xAxis: {
                categories: data.barras.comunas,
                title: { text: "Comuna" },
                labels: { rotation: -45 }
            },
            yAxis: {
                title: { text: "N° Voluntarios" },
                allowDecimals: false
            },
            series: [{
                name: "Voluntarios",
                data: data.barras.totales
            }]
        });

    } catch (error) {
        console.error("Error cargando los gráficos:", error);
    }
});
