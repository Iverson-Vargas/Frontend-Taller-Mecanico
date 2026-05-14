import React, { useState, useEffect } from 'react';
import api from '../services/axios.js';

export const Facturacion = () => {
  const [ordenServicio, setOrdenServicio] = useState("");
  const [ordenCargada, setOrdenCargada] = useState(false);
  const [detalles, setDetalles] = useState({ repuestos: [], servicios: [] });
  const [subtotalUSD, setSubtotalUSD] = useState(0);
  const [subtotalBs, setSubtotalBs] = useState(0);
  const [iva, setIva] = useState(0);
  const [igtf, setIgtf] = useState(0);

  const [ordenesFinalizadas, setOrdenesFinalizadas] = useState([]);
  const [facturasGeneradas, setFacturasGeneradas] = useState([]);
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: '' });
  
  // Estado para el modal de detalle
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [detallesModal, setDetallesModal] = useState({ repuestos: [], servicios: [] });
  const [cargandoDetalles, setCargandoDetalles] = useState(false);

  // Obtener usuario en sesión
  const usuarioSesion = JSON.parse(localStorage.getItem('usuario') || '{}');

  const mostrarNotificacion = (mensaje, tipo = "success") => {
    setNotificacion({ visible: true, mensaje, tipo });
    setTimeout(() => {
      setNotificacion({ visible: false, mensaje: '', tipo: '' });
    }, 4500);
  };

  const fetchFacturas = async () => {
    try {
      const response = await api.get('/facturas');
      const dataPayload = response.data.data;
      
      // Extracción inteligente
      let facturasArray = [];
      if (Array.isArray(dataPayload)) {
        facturasArray = dataPayload;
      } else if (dataPayload && Array.isArray(dataPayload.facturas)) {
        facturasArray = dataPayload.facturas;
      }
      setFacturasGeneradas(facturasArray);
    } catch (error) {
      console.error('Error al obtener facturas:', error);
    }
  };

  const abrirDetalleFactura = async (factura) => {
    setFacturaSeleccionada(factura);
    setCargandoDetalles(true);
    setDetallesModal({ repuestos: [], servicios: [] });
    try {
      const response = await api.get(`/ordenes/${factura.id_orden}`);
      const ordenEncontrada = response.data.data.orden || response.data.data;

      const repuestos = ordenEncontrada.detalles_repuestos?.map(req => ({
           descripcion: req.repuesto?.descripcion || 'Repuesto',
           precio: Number(req.repuesto?.precio_venta_sugerido || 0) * req.cantidad,
           cantidad: req.cantidad
      })) || ordenEncontrada.detalles?.repuestos || [];

      const servicios = ordenEncontrada.detalles_servicios?.map(serv => ({
           descripcion: serv.servicio?.nombre_servicio || 'Servicio',
           precio: Number(serv.precio_aplicado || serv.servicio?.precio_base || 0)
      })) || ordenEncontrada.detalles?.servicios || [];
      
      setDetallesModal({ repuestos, servicios });
    } catch (error) {
      console.error('Error obteniendo detalles:', error);
    } finally {
      setCargandoDetalles(false);
    }
  };

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const response = await api.get('/ordenes/finalizadas');
        const dataPayload = response.data.data;

        // Extracción inteligente
        let ordenesArray = [];
        if (Array.isArray(dataPayload)) {
          ordenesArray = dataPayload;
        } else if (dataPayload && Array.isArray(dataPayload.ordenes)) {
          ordenesArray = dataPayload.ordenes;
        }
        setOrdenesFinalizadas(ordenesArray);
      } catch (error) {
        console.error('Error de red al obtener órdenes:', error);
      }
    };
    fetchOrdenes();
    fetchFacturas();
  }, []);

  const [tasaCambio, setTasaCambio] = useState(0);
  const [pagos, setPagos] = useState([{ metodo: "", moneda: "", monto: 0 }]);

  const buscarOrdenServicio = async () => {
    if (!ordenServicio) {
      mostrarNotificacion("Por favor seleccione una orden de servicio.", "error");
      return;
    }

    try {
      const response = await api.get(`/ordenes/${ordenServicio}`);
      const ordenEncontrada = response.data.data.orden || response.data.data;

      const repuestos = ordenEncontrada.detalles_repuestos?.map(req => ({
           descripcion: req.repuesto?.descripcion || 'Repuesto',
           precio: Number(req.repuesto?.precio_venta_sugerido || 0) * req.cantidad
      })) || ordenEncontrada.detalles?.repuestos || [];

      const servicios = ordenEncontrada.detalles_servicios?.map(serv => ({
           descripcion: serv.servicio?.nombre_servicio || 'Servicio',
           precio: Number(serv.precio_aplicado || serv.servicio?.precio_base || 0)
      })) || ordenEncontrada.detalles?.servicios || [];

      const detallesMapeados = { repuestos, servicios };
      setDetalles(detallesMapeados);
      calcularTotales(detallesMapeados);
      setOrdenCargada(true);

    } catch (error) {
      console.error('Error al buscar la orden de servicio:', error);
      mostrarNotificacion("Orden de Servicio no encontrada o no está finalizada.", "error");
      setOrdenCargada(false);
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

  const generarFactura = async () => {
    if (!ordenServicio) {
      mostrarNotificacion("Seleccione una orden de servicio a facturar.", "error");
      return;
    }
    if (!ordenCargada) {
      mostrarNotificacion("Debe pulsar el botón 'Buscar' para cargar los detalles antes de facturar.", "error");
      return;
    }
    if (!pagos[0]?.metodo) {
      mostrarNotificacion("Debe seleccionar un Método de Pago.", "error");
      return;
    }
    if (!pagos[0]?.moneda) {
      mostrarNotificacion("Debe seleccionar la Moneda en la que se realiza el pago.", "error");
      return;
    }
    if (pagos[0]?.moneda === "Bs" && (!tasaCambio || Number(tasaCambio) <= 0)) {
      mostrarNotificacion("Especifique una Tasa de Cambio válida mayor a 0 para el cálculo en Bs.", "error");
      return;
    }
    if (!pagos[0]?.monto || Number(pagos[0]?.monto) <= 0) {
      mostrarNotificacion("Debe ingresar un monto pagado superior a 0.", "error");
      return;
    }
    
    const totalUSDCalculado = subtotalUSD + iva + igtf;
    const totalBsCalculado = subtotalBs + (totalUSDCalculado * Number(tasaCambio));

    // Preparar el objeto asegurando los campos exactos del schema Factura
    const facturaData = {
      id_orden: parseInt(ordenServicio), // Int según Prisma (id_orden)
      monto_total: totalUSDCalculado,    // Decimal según Prisma
      metodo_pago: pagos[0]?.metodo || "Efectivo", // String según Prisma (metodo_pago)
      cedula_cajero: usuarioSesion.cedula_rif || null, // Guardamos la identidad de quien opera
      
      // Campos extra opcionales para control
      tasa_cambio: Number(tasaCambio),
      subtotal_usd: subtotalUSD,
      subtotal_bs: subtotalBs,
      iva: iva,
      igtf: igtf,
      total_usd: totalUSDCalculado,
      total_bs: totalBsCalculado,
      pagos: pagos
    };

    try {
      await api.post('/facturas', facturaData);

      mostrarNotificacion('¡Factura generada con éxito!', 'success');
      // Limpiar los campos o refrescar datos
      setOrdenServicio("");
      setOrdenCargada(false);
      setDetalles({ repuestos: [], servicios: [] });
      setSubtotalUSD(0);
      setSubtotalBs(0);
      setIva(0);
      setIgtf(0);
      setTasaCambio(0);
      setPagos([{ metodo: "", moneda: "", monto: 0 }]);
      fetchFacturas();
      
    } catch (err) {
      console.error('Error al enviar la factura:', err);
      // Validaciones de status 400
      if (err.response?.status === 400 && err.response.data?.errors) {
        const msgs = err.response.data.errors.map(e => e.msg).join(' | ');
        mostrarNotificacion(msgs, 'error');
      } else {
        mostrarNotificacion(err.response?.data?.error || "Error al generar la factura en el servidor.", "error");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6">
            Módulo de <span className="text-[#F43F5E]">Facturación</span>
        </h1>

        {/* ── Info del Usuario ── */}
        {usuarioSesion.nombre && (
            <div className="mb-6 bg-white px-5 py-3 rounded-xl border border-slate-200 inline-flex items-center gap-2 shadow-sm">
              <span className="text-slate-400">👤</span>
              <span className="text-sm text-slate-600 font-semibold">Operador actual: </span>
              <span className="text-sm text-slate-800 font-bold">{usuarioSesion.nombre}</span>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium ml-2">{usuarioSesion.rol}</span>
            </div>
        )}

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
                        onChange={(e) => {
                          setOrdenServicio(e.target.value);
                          setOrdenCargada(false);
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none text-slate-800 text-sm font-medium transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="text-slate-400">Seleccione una orden...</option>
                        {ordenesFinalizadas
                          .filter((orden) => !facturasGeneradas.some(f => f.id_orden === (orden.id_orden || orden.id)))
                          .map((orden) => (
                          <option key={orden.id_orden || orden.id} value={orden.id_orden || orden.id} className="text-slate-800 py-2">
                            Orden #{orden.id_orden || orden.id} - Placa: {orden.placa_carro || orden.descripcion || 'N/A'}
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
              onClick={generarFactura}
              className="cursor-pointer w-full bg-[#F43F5E] text-white py-3.5 px-4 rounded-xl hover:bg-rose-600 transition-colors font-bold shadow-md transform active:scale-[0.98] text-sm"
            >
              Generar Factura
            </button>
          </div>
        </div>
      
        {/* Historial de Facturas */}
        <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">Historial de Facturas Emitidas</h2>
                <button onClick={fetchFacturas} className="cursor-pointer text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Actualizar
                </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Factura</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehículo / Detalle</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Método de Pago</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Monto Total</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {facturasGeneradas.length > 0 ? (
                    facturasGeneradas.map((factura) => (
                        <tr key={factura.id_factura} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 text-sm">
                            <p className="font-extrabold text-[#F43F5E]">#{factura.id_factura}</p>
                            <p className="text-xs font-medium text-slate-500">{new Date(factura.fecha_emision).toLocaleDateString()}</p>
                        </td>
                        <td className="px-5 py-4 text-sm">
                            <p className="font-bold text-slate-800">Orden #{factura.id_orden}</p>
                            <p className="text-xs font-medium text-slate-500 truncate max-w-[200px]">Placa: {factura.orden?.placa_carro || 'N/A'}</p>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-600">
                            <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold shadow-sm">
                                {factura.metodo_pago || 'No especificado'}
                            </span>
                        </td>
                        <td className="px-5 py-4 text-base font-extrabold text-emerald-600 text-right">
                            ${Number(factura.monto_total).toFixed(2)}
                        </td>
                        <td className="px-5 py-4 text-center">
                            <button 
                              onClick={() => abrirDetalleFactura(factura)}
                              className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                                Ver Detalle
                            </button>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="5" className="px-4 py-12 text-center text-slate-400 text-sm font-medium border-dashed border-2 m-4 rounded-xl">
                        Aún no se han emitido facturas en el sistema.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>

      </div>

      {/* Modal Detalles de Factura */}
      {facturaSeleccionada && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-6 bg-slate-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold">Detalle de Factura #{facturaSeleccionada.id_factura}</h3>
                <p className="text-slate-300 text-sm">Orden de Servicio #{facturaSeleccionada.id_orden}</p>
              </div>
              <button onClick={() => setFacturaSeleccionada(null)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {cargandoDetalles ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F43F5E]"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase">Vehículo</p>
                      <p className="font-semibold text-slate-800">Placa: {facturaSeleccionada.orden?.placa_carro || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase">Diagnóstico Inicial</p>
                      <p className="font-semibold text-slate-800 truncate" title={facturaSeleccionada.orden?.diagnostico_inicial}>
                        {facturaSeleccionada.orden?.diagnostico_inicial || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-3 border-b pb-2">Repuestos y Servicios Facturados</h4>
                    {detallesModal.repuestos.length === 0 && detallesModal.servicios.length === 0 ? (
                      <p className="text-sm text-slate-500 italic">No hay detalles específicos registrados en esta orden.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                          <tr>
                            <th className="py-2 px-3 text-left">Tipo</th>
                            <th className="py-2 px-3 text-left">Descripción</th>
                            <th className="py-2 px-3 text-right">Precio</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {detallesModal.repuestos.map((item, idx) => (
                            <tr key={`rm-${idx}`}>
                              <td className="py-2 px-3 text-slate-500 font-medium">Repuesto</td>
                              <td className="py-2 px-3 font-semibold text-slate-700">{item.descripcion} {item.cantidad > 1 ? `(x${item.cantidad})` : ''}</td>
                              <td className="py-2 px-3 text-right font-bold">${item.precio.toFixed(2)}</td>
                            </tr>
                          ))}
                          {detallesModal.servicios.map((item, idx) => (
                            <tr key={`sm-${idx}`}>
                              <td className="py-2 px-3 text-slate-500 font-medium">Servicio</td>
                              <td className="py-2 px-3 font-semibold text-slate-700">{item.descripcion}</td>
                              <td className="py-2 px-3 text-right font-bold">${item.precio.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="border-t-2 border-slate-100 pt-4 mt-6">
                    <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <div className="text-emerald-800">
                        <p className="text-xs tracking-wider uppercase font-bold text-emerald-600">Total Facturado</p>
                        <p className="font-medium text-sm">Vía {facturaSeleccionada.metodo_pago}</p>
                      </div>
                      <p className="text-2xl font-black text-emerald-600">
                        ${Number(facturaSeleccionada.monto_total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notificación */}
      {notificacion.visible && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-300 z-50 ${notificacion.tipo === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`} style={{ animation: 'bounce 0.5s' }}>
            {notificacion.tipo === 'success' ? (
                <div className="bg-white/20 p-1 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
            ) : (
                <div className="bg-white/20 p-1 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
            )}
            <p className="font-bold text-sm tracking-wide">{notificacion.mensaje}</p>
        </div>
      )}
    </div>
  );
};

export default Facturacion;
