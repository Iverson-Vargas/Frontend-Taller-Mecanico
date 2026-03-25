import React, { useState, useEffect } from 'react';

export const Facturacion = () => {
  const [ordenServicio, setOrdenServicio] = useState("");
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
    const ordenesSimuladas = [
      { id: "OS12345", detalles: { repuestos: [{ descripcion: "Filtro de aire", precio: 10 }], servicios: [{ descripcion: "Alineación", precio: 25 }] } },
      { id: "OS54321", detalles: { repuestos: [{ descripcion: "Aceite", precio: 20 }], servicios: [{ descripcion: "Cambio de aceite", precio: 30 }] } },
      { id: "OS22334", detalles: { repuestos: [{ descripcion: "Bujías", precio: 40 }], servicios: [{ descripcion: "Revisión de motor", precio: 60 }] } },
    ];

    const ordenEncontrada = ordenesSimuladas.find((os) => os.id === ordenServicio);

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
    <div className="p-6 min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6">
            Módulo de <span className="text-[#F43F5E]">Facturación</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna Izquierda */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-[#F43F5E] pl-3">Búsqueda y Desglose</h2>

            {/* Selector de OS */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Seleccionar Orden de Servicio</label>
              <div className="flex gap-3">
                  <div className="relative w-full">
                      <select
                        value={ordenServicio}
                        onChange={(e) => setOrdenServicio(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none text-slate-800 text-sm font-medium transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="text-slate-400">Seleccione una orden...</option>
                        {ordenesFinalizadas.map((orden) => (
                          <option key={orden.id} value={orden.id} className="text-slate-800 py-2">
                            {orden.descripcion}
                          </option>
                        ))}
                      </select>
                      {/* Icono de flecha personalizado para el select */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                      </div>
                  </div>
                  <button
                    onClick={buscarOrdenServicio}
                    className=" cursor-pointer bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-900 transition-colors font-bold text-sm whitespace-nowrap"
                  >
                    Buscar
                  </button>
              </div>
            </div>

            {/* Tabla de Desglose */}
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 p-4 bg-slate-50 border-b border-slate-200">Detalles de la Orden</h3>
              <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Categoría</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Descripción</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {detalles.repuestos.map((item, index) => (
                        <tr key={`rep-${index}`} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-slate-500">Repuesto</td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">{item.descripcion}</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-800 text-right">${item.precio}</td>
                        </tr>
                      ))}
                      {detalles.servicios.map((item, index) => (
                        <tr key={`serv-${index}`} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-slate-500">Servicio</td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">{item.descripcion}</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-800 text-right">${item.precio}</td>
                        </tr>
                      ))}
                      {detalles.repuestos.length === 0 && detalles.servicios.length === 0 && (
                          <tr>
                            <td colSpan="3" className="px-4 py-8 text-center text-slate-400 text-sm">
                                No hay items seleccionados para esta orden.
                            </td>
                          </tr>
                      )}
                    </tbody>
                  </table>
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-slate-800 pl-3">Totales y Pagos</h2>

            {/* Panel de Tasa del Día */}
            <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Tasa de Cambio (Bs/USD)</label>
              <input
                type="number"
                value={tasaCambio}
                onChange={(e) => setTasaCambio(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none text-slate-800 font-bold text-sm transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Resumen Matemático */}
            <div className="mb-6 space-y-2.5">
              <div className="flex justify-between items-center text-slate-600 text-sm">
                  <span className="font-medium">Subtotal (USD)</span>
                  <span className="font-bold text-base text-slate-800">${subtotalUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 text-sm">
                  <span className="font-medium">IVA (16%)</span>
                  <span className="font-bold text-base text-slate-800">${iva.toFixed(2)}</span>
              </div>
              {igtf > 0 && (
                  <div className="flex justify-between items-center text-[#F43F5E] text-sm">
                      <span className="font-bold">IGTF (3%)</span>
                      <span className="font-bold text-base">${igtf.toFixed(2)}</span>
                  </div>
              )}
              <div className="border-t-2 border-slate-100 pt-3 mt-3">
                  <div className="flex justify-between items-center text-slate-900 mb-1">
                      <span className="font-extrabold text-lg">Total (USD)</span>
                      <span className="font-extrabold text-xl text-emerald-600">${(subtotalUSD + iva + igtf).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                      <span className="text-xs font-bold uppercase">Total (Bs)</span>
                      <span className="text-sm font-bold">Bs {subtotalBs.toFixed(2)}</span>
                  </div>
              </div>
            </div>

            {/* Sección de Pagos */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase text-slate-500 mb-3">Método de Pago</h3>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                    <div className="relative w-1/2">
                        <select
                        value={pagos[0]?.metodo || ""}
                        onChange={(e) => actualizarPago(0, "metodo", e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none text-sm font-medium text-slate-800 transition-all appearance-none cursor-pointer"
                        >
                        <option value="" className="text-slate-400">Método</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Pago Móvil">Pago Móvil</option>
                        <option value="Zelle">Zelle</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    
                    <div className="relative w-1/2">
                        <select
                        value={pagos[0]?.moneda || ""}
                        onChange={(e) => actualizarPago(0, "moneda", e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none text-sm font-medium text-slate-800 transition-all appearance-none cursor-pointer"
                        >
                        <option value="" className="text-slate-400">Moneda</option>
                        <option value="USD">USD</option>
                        <option value="Bs">Bs</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
                <input
                  type="number"
                  value={pagos[0]?.monto || 0}
                  onChange={(e) => actualizarPago(0, "monto", parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none text-slate-900 font-bold text-sm transition-all"
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
              className="cursor-pointer w-full bg-[#F43F5E] text-white py-3.5 px-4 rounded-xl hover:bg-rose-600 transition-colors font-bold shadow-md transform active:scale-[0.98] text-sm"
            >
              Generar Factura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facturacion;