import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Reportes = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-16 px-5 font-sans flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full relative">
                
                {/* MENÚ CENTRAL - DISEÑO HERO CARD */}
                <div className="flex justify-center relative z-10">
                    <div 
                        onClick={() => navigate('/panel/Reporte-Inventario')}
                        className="group relative bg-white rounded-[2rem] p-10 max-w-lg w-full border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2 hover:border-indigo-200"
                    >
                        {/* Decoración de fondo de la tarjeta */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100/60 transition-colors duration-700"></div>
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-rose-50/50 rounded-full blur-3xl group-hover:bg-rose-100/60 transition-colors duration-700"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-[#F43F5E] text-white rounded-3xl flex items-center justify-center text-5xl mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3 ring-4 ring-indigo-50">
                                📦
                            </div>
                            
                            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
                                Movimiento y Valor del Inventario
                            </h2>
                            
                            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
                                Analiza en tiempo real las entradas, salidas y la valorización financiera total del stock alojado en tu inventario.
                            </p>
                            
                            <div className="flex items-center justify-center gap-3 bg-slate-100 text-indigo-600 font-extrabold text-lg px-8 py-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 w-full shadow-sm group-hover:shadow-indigo-200">
                                Visualizar Reporte
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ELEMENTOS DECORATIVOS DE FONDO GENERAL */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-200/20 blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/20 blur-[100px]"></div>
                </div>

            </div>
        </div>
    );
};