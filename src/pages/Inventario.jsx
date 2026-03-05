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
    <div style={styles.main}>
      {/* VENTANA DE VENTA */}
      {modalVenta.abierto && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Vender {modalVenta.producto.desc}</h3>
            <p style={{color: 'green', fontWeight: 'bold'}}>Precio: ${modalVenta.producto.pVenta}</p>
            <div style={{margin: '15px 0'}}>
              <label>Cantidad:</label><br/>
              <input type="number" value={modalVenta.cantidadVenta} onChange={e => setModalVenta({...modalVenta, cantidadVenta: e.target.value})} style={{...styles.input, width: '60%'}} />
            </div>
            <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
              <button onClick={() => setModalVenta({abierto:false})} style={styles.btnSecundario}>Cerrar</button>
              <button onClick={confirmarVenta} style={styles.btnRosa}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      <div style={{display:'flex', gap:'20px', marginBottom:'20px'}}>
        <div style={styles.miniCard}><span>GANANCIA TOTAL:</span> <h2 style={{color:'green'}}>${gananciaTotal.toFixed(2)}</h2></div>
        <div style={styles.miniCard}><span>VALOR STOCK:</span> <h2>${inversionStock.toFixed(2)}</h2></div>
      </div>

      {/* FORMULARIO */}
      <div style={styles.card}>
        <form onSubmit={guardar} style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <input placeholder="Cod" value={form.id} onChange={e => setForm({...form, id: e.target.value})} style={styles.input} />
          <input placeholder="Desc" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} style={styles.input} />
          <input placeholder="Ubic" value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} style={styles.input} />
          <input placeholder="Compra" type="number" value={form.pCompra} onChange={e => setForm({...form, pCompra: e.target.value})} style={styles.input} />
          <input placeholder="Venta" type="number" value={form.pVenta} onChange={e => setForm({...form, pVenta: e.target.value})} style={styles.input} />
          <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={styles.input} />
          <button type="submit" style={styles.btnNegro}>GUARDAR</button>
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