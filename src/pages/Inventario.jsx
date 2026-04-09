import React, { useState } from 'react';

const colors = {
  fondo: '#e0f2f1', blanco: '#ffffff', rosaBtn: '#f8bbd0', rosaTexto: '#880e4f', grisBorde: '#dddddd', texto: '#333333'
};

const styles = {
  main: { backgroundColor: colors.fondo, minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center' },
  btnSecundario: { background: '#eee', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' },
  miniCard: { backgroundColor: 'white', padding: '15px', borderRadius: '12px', flex: 1, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  cardTitle: { borderLeft: `5px solid ${colors.rosaBtn}`, paddingLeft: '10px', marginBottom: '15px' },
  input: { padding: '8px', borderRadius: '6px', border: `1px solid ${colors.grisBorde}`, width: '100px' },
  btnNegro: { background: '#333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
  btnRosa: { backgroundColor: colors.rosaBtn, color: colors.rosaTexto, border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' },
  td: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }
};


export function Inventario() {
  const [repuestos, setRepuestos] = useState([
    { id: 'REP-001', desc: 'Pastillas de Freno', ubicacion: 'A1', pCompra: 10, pVenta: 25, stock: 10, gananciaAcumulada: 0 }
  ]);
  const [form, setForm] = useState({ id: '', desc: '', ubicacion: '', pCompra: '', pVenta: '', stock: '' });
  const [modalVenta, setModalVenta] = useState({ abierto: false, producto: null, cantidadVenta: 1 });

  const gananciaTotal = repuestos.reduce((acc, r) => acc + r.gananciaAcumulada, 0);
  const inversionStock = repuestos.reduce((acc, r) => acc + (r.pCompra * r.stock), 0);

  const guardar = (e) => {
    e.preventDefault();
    if(!form.id) return alert("Pon el código");
    setRepuestos([...repuestos, { ...form, stock: Number(form.stock), pCompra: Number(form.pCompra), pVenta: Number(form.pVenta), gananciaAcumulada: 0 }]);
    setForm({ id: '', desc: '', ubicacion: '', pCompra: '', pVenta: '', stock: '' });
  };

  const confirmarVenta = () => {
    const cant = Number(modalVenta.cantidadVenta);
    if (cant > modalVenta.producto.stock) return alert("Stock insuficiente");
    
    setRepuestos(repuestos.map(r => {
      if (r.id === modalVenta.producto.id) {
        return { 
          ...r, 
          stock: r.stock - cant, 
          gananciaAcumulada: r.gananciaAcumulada + (cant * (r.pVenta - r.pCompra)) 
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
                                Vender <span className="text-[#F43F5E]">{modalVenta.producto.desc}</span>
                            </h3>
                            <p className="text-emerald-600 font-bold text-lg mb-4">
                                Precio ud: ${modalVenta.producto.pVenta}
                            </p>
                            
                            <div className="mb-6 text-left">
                                <label className="text-xs font-bold uppercase text-slate-600 mb-1.5 block text-center">Cantidad a vender:</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={modalVenta.cantidadVenta} 
                                    onChange={e => setModalVenta({...modalVenta, cantidadVenta: e.target.value})} 
                                    className="w-24 mx-auto block text-center px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent outline-none text-slate-800 font-bold text-lg" 
                                />
                            </div>
                            
                            <div className="flex gap-3 justify-center">
                                <button 
                                    onClick={() => setModalVenta({abierto:false})} 
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
                            <input placeholder="Código" required value={form.id} onChange={e => setForm({...form, id: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
                        </div>
                        <div className="col-span-2 md:col-span-2">
                            <input placeholder="Descripción del artículo" required value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <input placeholder="Ubicación" required value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <input placeholder="P.Compra ($)" required type="number" step="0.01" value={form.pCompra} onChange={e => setForm({...form, pCompra: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <input placeholder="P.Venta ($)" required type="number" step="0.01" value={form.pVenta} onChange={e => setForm({...form, pVenta: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <input placeholder="Stock ud." required type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#F43F5E] focus:border-transparent" />
                        </div>
                        <div className="col-span-2 md:col-span-7 mt-2">
                            <button type="submit" className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 text-white border-none px-6 py-2.5 rounded-lg cursor-pointer font-bold transition-colors shadow-sm">
                                Guardar Registro
                            </button>
                        </div>
                    </form>
                </div>

      {/* TABLA */}
      <div style={styles.card}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th style={styles.td}>ID</th>
              <th style={styles.td}>DESCRIPCIÓN</th>
              <th style={styles.td}>UBICACIÓN</th>
              <th style={styles.td}>P. COMPRA</th>
              <th style={styles.td}>P. VENTA</th>
              <th style={styles.td}>STOCK</th>
              <th style={styles.td}>GANANCIA</th>
              <th style={styles.td}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {repuestos.map(r => (
              <tr key={r.id}>
                <td style={styles.td}>{r.id}</td>
                <td style={styles.td}>{r.desc}</td>
                <td style={styles.td}>{r.ubicacion}</td>
                <td style={styles.td}>${r.pCompra}</td>
                <td style={styles.td}>${r.pVenta}</td>
                <td style={{...styles.td, color: r.stock < 3 ? 'red' : 'black'}}>{r.stock} uds</td>
                <td style={{...styles.td, color:'green', fontWeight:'bold'}}>${r.gananciaAcumulada.toFixed(2)}</td>
                <td style={styles.td}>
                  <button onClick={() => setModalVenta({abierto:true, producto:r, cantidadVenta:1})} style={styles.btnRosa}>Vender</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}