import React, { useState, useEffect } from 'react';

export const Facturacion = () => {
  const [ordenServicio, setOrdenServicio] = useState("","OS12345","OS54321","OS22334");
  const [detalles, setDetalles] = useState({ repuestos: [], servicios: [] });
  const [subtotalUSD, setSubtotalUSD] = useState(0);
  const [subtotalBs, setSubtotalBs] = useState(0);
  const [iva, setIva] = useState(0);
  const [igtf, setIgtf] = useState(0);

  const [ordenesFinalizadas] = useState([
    { id: "OS12345", descripcion: "Orden 12345" },
    { id: "OS54321", descripcion: "Orden 54321" },
    { id: "OS22334", descripcion: "Orden 22334" },
  ]);

  const [tasaCambio, setTasaCambio] = useState(0);
  const [pagos, setPagos] = useState([{ metodo: "", moneda: "", monto: 0 }]);

  const buscarOrdenServicio = () => {
    // Simulación de búsqueda de OS con estado 'Finalizado'
    const ordenesFinalizadas = [
      { id: "OS12345", detalles: { repuestos: [{ descripcion: "Filtro de aire", precio: 10 }], servicios: [{ descripcion: "Alineación", precio: 25 }] } },
      { id: "OS54321", detalles: { repuestos: [{ descripcion: "Aceite", precio: 20 }], servicios: [{ descripcion: "Cambio de aceite", precio: 30 }] } },
      { id: "OS22334", detalles: { repuestos: [{ descripcion: "Bujías", precio: 40 }], servicios: [{ descripcion: "Revisión de motor", precio: 60 }] } },
    ];

    const ordenEncontrada = ordenesFinalizadas.find((os) => os.id === ordenServicio);

    if (ordenEncontrada) {
      setDetalles(ordenEncontrada.detalles);
      calcularTotales(ordenEncontrada.detalles);
    } else {
      alert("Orden de Servicio no encontrada o no está finalizada.");
      setDetalles({ repuestos: [], servicios: [] });
      setSubtotalUSD(0);
      setSubtotalBs(0);
      setIva(0);
      setIgtf(0);
    }
  };

  const calcularTotales = (detalles) => {
    const subtotalUSD = detalles.repuestos.reduce((acc, item) => acc + item.precio, 0) +
                        detalles.servicios.reduce((acc, item) => acc + item.precio, 0);
    const subtotalBs = subtotalUSD * tasaCambio;
    const iva = subtotalUSD * 0.16;

    // Calcular IGTF si aplica
    const pagoEfectivoUSD = pagos.filter(
      (pago) => pago.metodo === "Efectivo" && pago.moneda === "USD"
    ).reduce((acc, pago) => acc + pago.monto, 0);

    const igtf = pagoEfectivoUSD > 0 ? pagoEfectivoUSD * 0.03 : 0;

    setSubtotalUSD(subtotalUSD);
    setSubtotalBs(subtotalBs);
    setIva(iva);
    setIgtf(igtf);
  };

  const agregarPago = () => {
    setPagos((prevPagos) => [...prevPagos, { metodo: "", moneda: "", monto: 0 }]);
  };

  // Efecto para recalcular IGTF automáticamente cuando cambian los pagos
  useEffect(() => {
    const pagoEfectivoUSD = pagos.filter(
      (pago) => pago.metodo === "Efectivo" && pago.moneda === "USD"
    ).reduce((acc, pago) => acc + pago.monto, 0);

    const nuevoIgtf = pagoEfectivoUSD > 0 ? pagoEfectivoUSD * 0.03 : 0;
    setIgtf(parseFloat(nuevoIgtf.toFixed(2)));
  }, [pagos]);

  const actualizarPago = (index, campo, valor) => {
    setPagos((prevPagos) => {
      const nuevosPagos = [...prevPagos];
      nuevosPagos[index][campo] = valor;

      // Lógica de autocompletado del monto
      if (campo === "metodo" || campo === "moneda") {
        const metodo = nuevosPagos[index].metodo;
        const moneda = nuevosPagos[index].moneda;
        const totalBase = subtotalUSD + iva; // Total sin IGTF

        if (moneda === "USD") {
          if (metodo === "Efectivo") {
            // Si es efectivo, calculamos el monto inverso para que cubra el 3% de IGTF
            // X = TotalBase / 0.97
            nuevosPagos[index].monto = parseFloat((totalBase / 0.97).toFixed(2));
          } else {
            // Si es Zelle u otro, es el monto exacto
            nuevosPagos[index].monto = parseFloat(totalBase.toFixed(2));
          }
        } else if (moneda === "Bs") {
          // Si es Bolívares, multiplicamos por la tasa
          nuevosPagos[index].monto = parseFloat((totalBase * Number(tasaCambio)).toFixed(2));
        }
      }

      return nuevosPagos;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {/* Columna Izquierda */}
      <div className="w-full lg:w-2/3 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Búsqueda y Desglose</h2>

        {/* Selector de OS */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Seleccionar Orden de Servicio</label>
          <select
            value={ordenServicio}
            onChange={(e) => setOrdenServicio(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccione una orden</option>
            {ordenesFinalizadas.map((orden) => (
              <option key={orden.id} value={orden.id}>
                {orden.descripcion}
              </option>
            ))}
          </select>
          <button
            onClick={buscarOrdenServicio}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Buscar
          </button>
        </div>

        {/* Tabla de Desglose */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Desglose</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Categoría</th>
                <th className="border border-gray-300 px-4 py-2">Descripción</th>
                <th className="border border-gray-300 px-4 py-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {detalles.repuestos.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">Repuesto</td>
                  <td className="border border-gray-300 px-4 py-2">{item.descripcion}</td>
                  <td className="border border-gray-300 px-4 py-2">${item.precio}</td>
                </tr>
              ))}
              {detalles.servicios.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">Servicio</td>
                  <td className="border border-gray-300 px-4 py-2">{item.descripcion}</td>
                  <td className="border border-gray-300 px-4 py-2">${item.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="w-full lg:w-1/3 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Totales, Impuestos y Pagos</h2>

        {/* Panel de Tasa del Día */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tasa de Cambio</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tasaCambio}
              onChange={(e) => setTasaCambio(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Resumen Matemático */}
        <div className="mb-4">
          <p>Subtotal (USD): ${subtotalUSD}</p>
          <p>Subtotal (Bs): {subtotalBs}</p>
          <p>IVA (16%): ${iva}</p>
          {igtf > 0 && <p>IGTF (3%): ${igtf}</p>}
        </div>

        {/* Sección de Pagos */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Método de Pago</h3>
          <div className="flex items-center gap-2 mb-4">
            <select
              value={pagos[0]?.metodo || ""}
              onChange={(e) => actualizarPago(0, "metodo", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-1/3"
            >
              <option value="">Método</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Pago Móvil">Pago Móvil</option>
              <option value="Zelle">Zelle</option>
            </select>
            <select
              value={pagos[0]?.moneda || ""}
              onChange={(e) => actualizarPago(0, "moneda", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-1/3"
            >
              <option value="">Moneda</option>
              <option value="USD">USD</option>
              <option value="Bs">Bs</option>
            </select>
            <input
              type="number"
              value={pagos[0]?.monto || 0}
              onChange={(e) => actualizarPago(0, "monto", parseFloat(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 w-1/3"
              placeholder="Monto"
            />
          </div>
        </div>

        {/* Botón de Facturar */}
        <div className="mt-4">
          <button
            onClick={() => {
              alert('Factura generada con éxito');
              // Cambiar el estado de la orden a 'Facturado'
              console.log(`Orden ${ordenServicio} marcada como Facturada`);
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all duration-300"
          >
            Facturar
          </button>
        </div>
      </div>
    </div>
  );
};
