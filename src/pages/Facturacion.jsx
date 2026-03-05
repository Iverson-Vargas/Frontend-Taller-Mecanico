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
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-black text-slate-900 mb-6">
            Módulo de <span className="text-pink-600">Facturación</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna Izquierda */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-lg font-black text-slate-900 mb-4">Búsqueda y Desglose</h2>

            {/* Selector de OS */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Seleccionar Orden de Servicio</label>
              <div className="flex gap-2">
                  <select
                    value={ordenServicio}
                    onChange={(e) => setOrdenServicio(e.target.value)}
                    className="w-full p-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-700 font-medium text-sm"
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
                    className="bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-700 transition-all font-bold shadow-lg shadow-slate-200 text-sm"
                  >
                    Buscar
                  </button>
              </div>
            </div>

            {/* Tabla de Desglose */}
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <h3 className="text-base font-bold text-slate-800 p-3 bg-slate-50">Detalles de la Orden</h3>
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Descripción</th>
                    <th className="px-4 py-2 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {detalles.repuestos.map((item, index) => (
                    <tr key={`rep-${index}`} className="hover:bg-pink-50/30 transition-colors">
                      <td className="px-4 py-2 text-sm font-medium text-slate-600">Repuesto</td>
                      <td className="px-4 py-2 text-sm text-slate-600">{item.descripcion}</td>
                      <td className="px-4 py-2 text-sm font-bold text-slate-800 text-right">${item.precio}</td>
                    </tr>
                  ))}
                  {detalles.servicios.map((item, index) => (
                    <tr key={`serv-${index}`} className="hover:bg-pink-50/30 transition-colors">
                      <td className="px-4 py-2 text-sm font-medium text-slate-600">Servicio</td>
                      <td className="px-4 py-2 text-sm text-slate-600">{item.descripcion}</td>
                      <td className="px-4 py-2 text-sm font-bold text-slate-800 text-right">${item.precio}</td>
                    </tr>
                  ))}
                  {detalles.repuestos.length === 0 && detalles.servicios.length === 0 && (
                     <tr>
                        <td colSpan="3" className="px-4 py-6 text-center text-slate-400 italic text-sm">
                            No hay items seleccionados
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 h-fit">
            <h2 className="text-lg font-black text-slate-900 mb-4">Totales y Pagos</h2>

            {/* Panel de Tasa del Día */}
            <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Tasa de Cambio (Bs/USD)</label>
              <input
                type="number"
                value={tasaCambio}
                onChange={(e) => setTasaCambio(e.target.value)}
                className="w-full p-2 bg-white rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 font-bold text-base"
                placeholder="0.00"
              />
            </div>

            {/* Resumen Matemático */}
            <div className="mb-6 space-y-2">
              <div className="flex justify-between items-center text-slate-600 text-sm">
                  <span>Subtotal (USD)</span>
                  <span className="font-bold text-base">${subtotalUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-sm">
                  <span>IVA (16%)</span>
                  <span className="font-bold text-base">${iva.toFixed(2)}</span>
              </div>
              {igtf > 0 && (
                  <div className="flex justify-between items-center text-pink-600 text-sm">
                      <span>IGTF (3%)</span>
                      <span className="font-bold text-base">${igtf.toFixed(2)}</span>
                  </div>
              )}
              <div className="border-t border-slate-200 pt-2 mt-2">
                  <div className="flex justify-between items-center text-slate-900">
                      <span className="font-black text-lg">Total (USD)</span>
                      <span className="font-black text-lg">${(subtotalUSD + iva + igtf).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 mt-1">
                      <span className="text-xs font-medium">Total (Bs)</span>
                      <span className="text-xs font-bold">Bs {subtotalBs.toFixed(2)}</span>
                  </div>
              </div>
            </div>

            {/* Sección de Pagos */}
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Método de Pago</h3>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <select
                    value={pagos[0]?.metodo || ""}
                    onChange={(e) => actualizarPago(0, "metodo", e.target.value)}
                    className="w-1/2 p-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-xs font-medium text-slate-700"
                    >
                    <option value="">Método</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Pago Móvil">Pago Móvil</option>
                    <option value="Zelle">Zelle</option>
                    </select>
                    <select
                    value={pagos[0]?.moneda || ""}
                    onChange={(e) => actualizarPago(0, "moneda", e.target.value)}
                    className="w-1/2 p-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-xs font-medium text-slate-700"
                    >
                    <option value="">Moneda</option>
                    <option value="USD">USD</option>
                    <option value="Bs">Bs</option>
                    </select>
                </div>
                <input
                  type="number"
                  value={pagos[0]?.monto || 0}
                  onChange={(e) => actualizarPago(0, "monto", parseFloat(e.target.value))}
                  className="w-full p-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 font-bold text-sm"
                  placeholder="Monto a pagar"
                />
              </div>
            </div>

            {/* Botón de Facturar */}
            <button
              onClick={() => {
                alert('Factura generada con éxito');
                console.log(`Orden ${ordenServicio} marcada como Facturada`);
              }}
              className="w-full bg-pink-600 text-white py-3 px-4 rounded-xl hover:bg-pink-700 transition-all duration-300 font-bold shadow-lg shadow-pink-200 transform active:scale-95 text-sm"
            >
              Generar Factura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
