import React, { useState, useEffect } from 'react';

export const Inventario = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [form, setForm] = useState({ id: '', desc: '', ubicacion: '', pCompra: '', pVenta: '', stock: '' });
  const [modalVenta, setModalVenta] = useState({ abierto: false, producto: null, cantidadVenta: 1 });

  const gananciaTotal = repuestos.reduce((acc, r) => acc + (Number(r.gananciaAcumulada) || 0), 0);
  const inversionStock = repuestos.reduce((acc, r) => acc + ((Number(r.precio_compra) || 0) * (Number(r.stock_actual) || 0)), 0);

  useEffect(() => {
    const obtenerRepuestos = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/inventario');
        const datos = await respuesta.json();
        setRepuestos(datos); // Esto llena la tabla con lo que hay en Postgres
      } catch (error) {
        console.error("Error al cargar repuestos:", error);
      }
    };

    obtenerRepuestos();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();

    // Validar que al menos tenga descripción
    if (!form.desc) return alert("Por favor, agrega una descripción");

    try {
      const respuesta = await fetch('http://localhost:3000/api/inventario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codigo_barra: form.id,
          descripcion: form.desc,
          stock_actual: parseInt(form.stock) || 0,
          precio_venta_sugerido: parseFloat(form.pVenta) || 0
        })
      });

      if (respuesta.ok) {
        window.location.reload();

        setForm({ id: '', desc: '', ubicacion: '', pCompra: '', pVenta: '', stock: '' });
        alert("¡Repuesto guardado en la Base de Datos!");
      } else {
        alert("Error al guardar en el servidor");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el Backend. ¿Está encendido?");
    }
  };

  const confirmarVenta = () => {
    const cant = Number(modalVenta.cantidadVenta);
    // Usamos stock_actual que es el nombre real en tu base de datos
    if (cant > (modalVenta.producto.stock_actual !== undefined ? modalVenta.producto.stock_actual : modalVenta.producto.stock)) return alert("Stock insuficiente para realizar esta venta.");

    setRepuestos(repuestos.map(r => {
      const idToCompare = r.id_repuesto || r.id;
      const modalId = modalVenta.producto.id_repuesto || modalVenta.producto.id;

      if (idToCompare === modalId) {
        // Calculamos la ganancia: (Venta - Compra) * Cantidad
        const pVenta = Number(r.precio_venta_sugerido || r.pVenta || 0);
        const pCompra = Number(r.precio_compra || r.pCompra || 0);
        const gananciaVenta = (pVenta - pCompra) * cant;

        return {
          ...r,
          stock_actual: (r.stock_actual !== undefined ? r.stock_actual : r.stock) - cant,
          gananciaAcumulada: (Number(r.gananciaAcumulada) || 0) + gananciaVenta
        };
      }
      return r;
    }));
    setModalVenta({ abierto: false, producto: null, cantidadVenta: 1 });
  };

  return (
    <div className="bg-slate-100 min-h-screen py-10 px-5 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* VENTANA DE VENTA (MODAL) */}
        {modalVenta.abierto && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl w-[350px] shadow-2xl text-center border border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">
                Vender <span className="text-[#F43F5E]">{modalVenta.producto.descripcion || modalVenta.producto.desc}</span>
              </h3>
              <p className="text-emerald-600 font-bold text-lg mb-4">
                Precio ud: ${modalVenta.producto.precio_venta_sugerido || modalVenta.producto.pVenta}
              </p>

              <div className="mb-6 text-left">
                <label className="text-xs font-bold uppercase text-slate-600 mb-1.5 block text-center">Cantidad a vender:</label>
                <input
                  type="number"
                  min="1"
                  value={modalVenta.cantidadVenta}
                  onChange={e => setModalVenta({ ...modalVenta, cantidadVenta: e.target.value })}
                  className="w-24 mx-auto block text-center px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none text-slate-800 font-bold text-lg"
                />
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setModalVenta({ abierto: false })}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-none py-2 px-5 rounded-xl cursor-pointer font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarVenta}
                  className="bg-[#F43F5E] hover:bg-rose-600 text-white border-none py-2 px-5 rounded-xl cursor-pointer font-bold transition-colors shadow-sm"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ENCABEZADO */}
        <header className="mb-8">
          <h1 className="text-3xl text-slate-800 font-extrabold m-0">
            Control de <span className="text-[#F43F5E]">Inventario</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">
            Gestión de repuestos, stock y cálculo de ganancias.
          </p>
        </header>

        {/* DASHBOARD (Tarjetas de resumen) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ganancia Total Acumulada</span>
            <h2 className="text-3xl font-extrabold text-emerald-500 m-0">${gananciaTotal.toFixed(2)}</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center border-l-4 border-l-[#F43F5E]">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Valor Total del Stock (Inversión)</span>
            <h2 className="text-3xl font-extrabold text-slate-800 m-0">${inversionStock.toFixed(2)}</h2>
          </div>
        </div>

        {/* FORMULARIO DE REGISTRO */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl mb-8">
          <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">➕ Agregar Repuesto</h2>
          <form onSubmit={guardar} className="grid grid-cols-2 md:grid-cols-7 gap-4 items-end">
            <div className="col-span-2 md:col-span-1">
              <input placeholder="Código" required value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
            </div>
            <div className="col-span-2 md:col-span-2">
              <input placeholder="Descripción del artículo" required value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <input placeholder="Ubicación" required value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <input placeholder="P.Compra ($)" required type="number" step="0.01" value={form.pCompra} onChange={e => setForm({ ...form, pCompra: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <input placeholder="P.Venta ($)" required type="number" step="0.01" value={form.pVenta} onChange={e => setForm({ ...form, pVenta: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <input placeholder="Stock ud." required type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
            </div>
            <div className="col-span-2 md:col-span-7 mt-2">
              <button type="submit" className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 text-white border-none px-6 py-2.5 rounded-lg cursor-pointer font-bold transition-colors shadow-sm">
                Guardar Registro
              </button>
            </div>
          </form>
        </div>

        {/* TABLA DE INVENTARIO */}
        <div className="bg-white p-0 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-white">
            <h2 className="text-lg text-slate-800 m-0 border-l-4 border-[#F43F5E] pl-3 font-bold">
              Catálogo de Repuestos
            </h2>
          </div>
          <div className="overflow-x-auto p-5 pt-0">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold rounded-tl-lg">ID</th>
                  <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">Descripción</th>
                  <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">Ubicación</th>
                  <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">P. Compra</th>
                  <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">P. Venta</th>
                  <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">Stock</th>
                  <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold">Ganancia</th>
                  <th className="text-left p-3.5 bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold rounded-tr-lg">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {repuestos.map((r) => (
                  <tr key={r.id_repuesto || r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 border-b border-slate-100 text-sm font-mono text-slate-500">{r.id_repuesto || r.id}</td>
                    <td className="p-3.5 border-b border-slate-100 text-sm text-slate-800 font-bold">{r.descripcion || r.desc}</td>
                    <td className="p-3.5 border-b border-slate-100 text-sm text-slate-600">{r.ubicacion || 'Sin asignar'}</td>
                    <td className="p-3.5 border-b border-slate-100 text-sm text-slate-600">${r.precio_compra || r.pCompra || 0}</td>
                    <td className="p-3.5 border-b border-slate-100 text-sm text-slate-800 font-semibold">${r.precio_venta_sugerido || r.pVenta}</td>
                    <td className="p-3.5 border-b border-slate-100 text-sm">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${(r.stock_actual !== undefined ? r.stock_actual : r.stock) < 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {r.stock_actual !== undefined ? r.stock_actual : r.stock} uds
                      </span>
                    </td>
                    <td className="p-3.5 border-b border-slate-100 text-sm text-emerald-600 font-bold">
                      ${(r.gananciaAcumulada || 0).toFixed(2)}
                    </td>
                    <td className="p-3.5 border-b border-slate-100 text-sm">
                      <button
                        onClick={() => setModalVenta({ abierto: true, producto: r, cantidadVenta: 1 })}
                        className="flex items-center gap-1 text-[#F43F5E] bg-rose-50 hover:bg-[#F43F5E] hover:text-white border border-rose-200 px-3 py-1 rounded-lg transition-all"
                      >
                        🛒 Vender
                      </button>
                    </td>
                  </tr>
                ))}
                {repuestos.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-500 text-sm">
                      No hay repuestos registrados en el inventario.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventario;