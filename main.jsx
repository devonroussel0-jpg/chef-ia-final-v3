import { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f0e0c; color: #f0ead6; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .app { min-height: 100vh; background: #0f0e0c; position: relative; overflow-x: hidden; }
  .noise { position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); }

  /* NAV */
  .topbar { border-bottom: 1px solid #1e1c18; position: relative; z-index: 10; }
  .nav { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; max-width: 960px; margin: 0 auto; gap: 12px; flex-wrap: wrap; }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 20px; color: #f0ead6; cursor: pointer; flex-shrink: 0; }
  .nav-logo em { font-style: italic; color: #c8a96e; }
  .nav-center { display: flex; gap: 4px; }
  .nav-tab { background: none; border: none; padding: 7px 13px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #5a5040; cursor: pointer; border-radius: 8px; transition: all 0.2s; white-space: nowrap; }
  .nav-tab:hover { color: #c8a96e; background: #1a1815; }
  .nav-tab.active { color: #c8a96e; background: #1a1815; }
  .nav-tab .badge { background: #c8a96e; color: #0f0e0c; border-radius: 10px; font-size: 10px; font-weight: 700; padding: 1px 6px; margin-left: 5px; }
  .nav-right { display: flex; align-items: center; gap: 8px; }
  .nav-btn { background: none; border: 1px solid #2e2a22; border-radius: 8px; padding: 6px 13px; color: #b0a490; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; }
  .nav-btn:hover { border-color: #c8a96e; color: #c8a96e; }
  .nav-btn.primary { background: #c8a96e; border-color: #c8a96e; color: #0f0e0c; font-weight: 500; }
  .nav-btn.primary:hover { background: #d4b87d; }
  .nav-avatar { width: 30px; height: 30px; border-radius: 50%; background: #c8a96e22; border: 1px solid #c8a96e; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #c8a96e; font-weight: 600; }

  /* AUTH MODAL */
  .modal-overlay { position: fixed; inset: 0; background: #0f0e0ccc; backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: #1a1815; border: 1px solid #2e2a22; border-radius: 20px; padding: 34px; width: 100%; max-width: 400px; animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 24px; color: #f0ead6; margin-bottom: 5px; }
  .modal-sub { font-size: 13px; color: #7a7060; margin-bottom: 24px; line-height: 1.5; }
  .form-field { margin-bottom: 14px; }
  .form-label { display: block; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #7a7060; margin-bottom: 6px; }
  .form-input { width: 100%; background: #0f0e0c; border: 1px solid #2e2a22; border-radius: 10px; padding: 11px 13px; color: #f0ead6; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: #c8a96e; }
  .form-input::placeholder { color: #3a3528; }
  .form-btn { width: 100%; background: #c8a96e; color: #0f0e0c; border: none; border-radius: 10px; padding: 12px; font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 6px; transition: background 0.2s; }
  .form-btn:hover { background: #d4b87d; }
  .form-btn:disabled { background: #2e2a22; color: #5a5040; cursor: not-allowed; }
  .form-switch { text-align: center; margin-top: 14px; font-size: 13px; color: #7a7060; }
  .form-switch button { background: none; border: none; color: #c8a96e; cursor: pointer; font-size: 13px; text-decoration: underline; }
  .form-error { background: #1c1010; border: 1px solid #3a2020; border-radius: 8px; padding: 9px 13px; color: #c87070; font-size: 13px; margin-bottom: 12px; }
  .modal-close { float: right; background: none; border: none; color: #5a5040; font-size: 20px; cursor: pointer; margin-top: -6px; }
  .modal-close:hover { color: #f0ead6; }

  /* HERO */
  .hero { text-align: center; padding: 40px 20px 24px; position: relative; z-index: 1; }
  .hero-label { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #c8a96e; margin-bottom: 10px; font-weight: 500; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 62px); font-weight: 700; line-height: 1.0; color: #f0ead6; margin-bottom: 8px; }
  .hero-title em { font-style: italic; color: #c8a96e; }
  .hero-sub { font-size: 13px; color: #7a7060; font-weight: 300; max-width: 320px; margin: 0 auto; line-height: 1.6; }

  /* MAIN */
  .main { max-width: 960px; margin: 0 auto; padding: 0 16px 80px; position: relative; z-index: 1; }

  /* LAYOUT */
  .layout { display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: start; margin-bottom: 20px; }
  @media (max-width: 700px) { .layout { grid-template-columns: 1fr; } }

  /* BROWSER PANEL */
  .browser-panel { background: #1a1815; border: 1px solid #2e2a22; border-radius: 16px; overflow: hidden; position: sticky; top: 16px; }
  .browser-search { padding: 12px 13px; border-bottom: 1px solid #2e2a22; }
  .browser-search input { width: 100%; background: #0f0e0c; border: 1px solid #2e2a22; border-radius: 8px; padding: 8px 11px; color: #f0ead6; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; transition: border-color 0.2s; }
  .browser-search input::placeholder { color: #3a3528; }
  .browser-search input:focus { border-color: #c8a96e; }
  .cat-tabs { display: flex; overflow-x: auto; border-bottom: 1px solid #2e2a22; scrollbar-width: none; }
  .cat-tabs::-webkit-scrollbar { display: none; }
  .cat-tab { padding: 9px 12px; font-size: 16px; cursor: pointer; border: none; background: none; transition: background 0.15s; flex-shrink: 0; border-bottom: 2px solid transparent; margin-bottom: -1px; }
  .cat-tab:hover { background: #1f1c18; }
  .cat-tab.active { border-bottom-color: #c8a96e; background: #1f1c18; }
  .ing-grid { display: flex; flex-wrap: wrap; gap: 5px; padding: 12px 13px; max-height: 340px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #2e2a22 transparent; }
  .ing-btn { background: #0f0e0c; border: 1px solid #2e2a22; border-radius: 14px; padding: 4px 10px; font-size: 12px; color: #b0a490; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; display: flex; align-items: center; gap: 4px; }
  .ing-btn:hover { border-color: #c8a96e; color: #c8a96e; }
  .ing-btn.selected { background: #c8a96e22; border-color: #c8a96e; color: #c8a96e; }
  .ing-btn.has-sub { padding-right: 6px; }
  .ing-arrow { font-size: 9px; opacity: 0.5; }
  .community-badge { font-size: 9px; background: #c8a96e22; border: 1px solid #c8a96e44; color: #c8a96e; border-radius: 4px; padding: 0 4px; }

  /* SUBMENU */
  .submenu-overlay { position: fixed; inset: 0; z-index: 150; display: flex; align-items: center; justify-content: center; padding: 20px; background: #0f0e0c99; backdrop-filter: blur(3px); animation: fadeIn 0.15s ease; }
  .submenu { background: #1a1815; border: 1px solid #2e2a22; border-radius: 16px; padding: 20px; min-width: 240px; max-width: 320px; width: 100%; animation: slideUp 0.2s ease; }
  .submenu-title { font-family: 'Playfair Display', serif; font-size: 16px; color: #f0ead6; margin-bottom: 4px; }
  .submenu-sub { font-size: 11px; color: #5a5040; margin-bottom: 14px; }
  .submenu-items { display: flex; flex-wrap: wrap; gap: 6px; }
  .submenu-item { background: #0f0e0c; border: 1px solid #2e2a22; border-radius: 14px; padding: 5px 12px; font-size: 12px; color: #b0a490; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .submenu-item:hover { border-color: #c8a96e; color: #c8a96e; }
  .submenu-item.selected { background: #c8a96e22; border-color: #c8a96e; color: #c8a96e; }
  .submenu-close { margin-top: 14px; width: 100%; background: none; border: 1px solid #2e2a22; border-radius: 8px; padding: 7px; font-size: 12px; color: #5a5040; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .submenu-close:hover { border-color: #c8a96e; color: #c8a96e; }

  /* SUGGEST */
  .suggest-box { width: 100%; padding: 10px 0 4px; text-align: center; }
  .suggest-label { font-size: 11px; color: #5a5040; margin-bottom: 7px; line-height: 1.5; }
  .suggest-label strong { color: #c8a96e; }
  .suggest-btn { background: #c8a96e22; border: 1px dashed #c8a96e; border-radius: 10px; padding: 7px 14px; font-size: 11px; color: #c8a96e; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; width: 100%; }
  .suggest-btn:hover { background: #c8a96e33; }
  .suggest-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* RIGHT PANEL */
  .right-panel { display: flex; flex-direction: column; gap: 13px; }
  .section-card { background: #1a1815; border: 1px solid #2e2a22; border-radius: 16px; padding: 18px 20px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 15px; color: #f0ead6; margin-bottom: 13px; display: flex; align-items: center; gap: 7px; }
  .section-title span { width: 5px; height: 5px; background: #c8a96e; border-radius: 50%; display: inline-block; }
  .input-row { display: flex; gap: 7px; margin-bottom: 12px; }
  .ingredient-input { flex: 1; background: #0f0e0c; border: 1px solid #2e2a22; border-radius: 8px; padding: 8px 12px; color: #f0ead6; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; transition: border-color 0.2s; }
  .ingredient-input::placeholder { color: #3a3528; }
  .ingredient-input:focus { border-color: #c8a96e; }
  .add-btn { background: #c8a96e; color: #0f0e0c; border: none; border-radius: 8px; padding: 8px 14px; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .add-btn:hover { background: #d4b87d; }
  .tags { display: flex; flex-wrap: wrap; gap: 5px; min-height: 28px; }
  .tag { background: #262218; border: 1px solid #3a3528; border-radius: 20px; padding: 3px 10px; font-size: 11.5px; color: #c8a96e; display: flex; align-items: center; gap: 5px; animation: tagIn 0.2s ease; }
  @keyframes tagIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
  .tag.clash { border-color: #5a3a10; color: #e09030; background: #1c1610; }
  .tag-remove { background: none; border: none; color: #5a5040; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; transition: color 0.15s; }
  .tag-remove:hover { color: #c8a96e; }
  .empty-tags { color: #3a3528; font-size: 12px; font-style: italic; }
  .options-row { display: flex; gap: 7px; flex-wrap: wrap; }
  .option-chip { background: #1a1815; border: 1px solid #2e2a22; border-radius: 20px; padding: 5px 12px; font-size: 12px; color: #7a7060; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .option-chip:hover { border-color: #c8a96e; color: #c8a96e; }
  .option-chip.active { background: #c8a96e22; border-color: #c8a96e; color: #c8a96e; }

  /* PERSONS */
  .persons-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .persons-label { font-size: 12px; color: #7a7060; flex: 1; }
  .persons-ctrl { display: flex; align-items: center; background: #0f0e0c; border: 1px solid #2e2a22; border-radius: 10px; overflow: hidden; }
  .persons-btn { background: none; border: none; color: #c8a96e; font-size: 17px; width: 34px; height: 34px; cursor: pointer; transition: background 0.15s; display: flex; align-items: center; justify-content: center; }
  .persons-btn:hover { background: #1a1815; }
  .persons-btn:disabled { color: #3a3528; cursor: not-allowed; }
  .persons-count-input { background: none; border: none; font-family: 'Playfair Display', serif; font-size: 17px; color: #f0ead6; width: 48px; text-align: center; outline: none; padding: 0; cursor: text; }
  .persons-count-input::-webkit-inner-spin-button, .persons-count-input::-webkit-outer-spin-button { -webkit-appearance: none; }
  .persons-presets { display: flex; gap: 5px; flex-wrap: wrap; }
  .persons-preset { background: #0f0e0c; border: 1px solid #2e2a22; border-radius: 12px; padding: 3px 10px; font-size: 11px; color: #7a7060; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .persons-preset:hover { border-color: #c8a96e; color: #c8a96e; }
  .persons-preset.active { background: #c8a96e22; border-color: #c8a96e; color: #c8a96e; }

  .generate-btn { width: 100%; background: #c8a96e; color: #0f0e0c; border: none; border-radius: 12px; padding: 14px 24px; font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s, transform 0.1s; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .generate-btn:hover:not(:disabled) { background: #d4b87d; }
  .generate-btn:active:not(:disabled) { transform: scale(0.99); }
  .generate-btn:disabled { background: #2e2a22; color: #5a5040; cursor: not-allowed; }

  /* LOADING */
  .loading { text-align: center; padding: 48px 20px; }
  .loader-ring { width: 42px; height: 42px; border: 2px solid #2e2a22; border-top-color: #c8a96e; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 14px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading p { color: #7a7060; font-size: 13px; font-style: italic; }

  /* WARNINGS */
  .warnings-box { background: #1c1610; border: 1px solid #5a3a10; border-radius: 14px; padding: 14px 18px; margin-bottom: 14px; animation: cardIn 0.3s ease; }
  .warnings-title { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #e09030; font-weight: 500; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .warnings-title::before { content: '⚠'; font-size: 12px; }
  .warning-item { display: flex; gap: 10px; padding: 6px 0; border-bottom: 1px solid #2a1e08; font-size: 12.5px; line-height: 1.6; color: #c8a060; }
  .warning-item:last-child { border-bottom: none; }
  .warning-pair { font-weight: 500; color: #e09030; white-space: nowrap; flex-shrink: 0; }

  /* RECIPES */
  .recipes-grid { display: grid; gap: 13px; }
  .recipe-card { background: #1a1815; border: 1px solid #2e2a22; border-radius: 16px; overflow: hidden; animation: cardIn 0.4s ease both; }
  .recipe-card:nth-child(2) { animation-delay: 0.08s; }
  .recipe-card:nth-child(3) { animation-delay: 0.16s; }
  @keyframes cardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .recipe-header { padding: 16px 20px 14px; border-bottom: 1px solid #2e2a22; cursor: pointer; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; transition: background 0.2s; }
  .recipe-header:hover { background: #1f1c18; }
  .recipe-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .recipe-badge { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #c8a96e; font-weight: 500; }
  .recipe-time { font-size: 11px; color: #5a5040; }
  .recipe-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #f0ead6; line-height: 1.2; margin-bottom: 4px; }
  .recipe-desc { font-size: 12.5px; color: #7a7060; line-height: 1.6; }
  .recipe-header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .save-btn { background: none; border: 1px solid #2e2a22; border-radius: 8px; padding: 5px 10px; font-size: 11px; color: #7a7060; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; white-space: nowrap; }
  .save-btn:hover { border-color: #c8a96e; color: #c8a96e; }
  .save-btn.saved { background: #c8a96e22; border-color: #c8a96e; color: #c8a96e; }
  .cart-btn { background: none; border: 1px solid #2e2a22; border-radius: 8px; padding: 5px 10px; font-size: 11px; color: #7a7060; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; white-space: nowrap; }
  .cart-btn:hover { border-color: #7a9e7a; color: #7a9e7a; }
  .cart-btn.added { background: #1a2e1a; border-color: #7a9e7a; color: #7a9e7a; }
  .chevron { color: #5a5040; font-size: 19px; transition: transform 0.3s; margin-top: 1px; }
  .chevron.open { transform: rotate(180deg); }
  .recipe-body { display: none; padding: 18px 20px; }
  .recipe-body.open { display: block; }
  .recipe-cols { display: grid; grid-template-columns: 1fr 2fr; gap: 24px; }
  @media (max-width: 520px) { .recipe-cols { grid-template-columns: 1fr; } }
  .recipe-section-title { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #5a5040; font-weight: 500; margin-bottom: 10px; }
  .ingredient-list { list-style: none; }
  .ingredient-list li { font-size: 12.5px; color: #b0a490; padding: 4px 0; border-bottom: 1px solid #1f1c18; display: flex; align-items: baseline; gap: 7px; line-height: 1.4; }
  .ingredient-list li::before { content: ''; width: 4px; height: 4px; background: #c8a96e; border-radius: 50%; flex-shrink: 0; }
  .steps-list { list-style: none; counter-reset: steps; }
  .steps-list li { counter-increment: steps; font-size: 12.5px; color: #b0a490; padding: 8px 0; border-bottom: 1px solid #1f1c18; display: flex; gap: 12px; line-height: 1.6; }
  .steps-list li::before { content: counter(steps); font-family: 'Playfair Display', serif; font-size: 15px; color: #c8a96e; flex-shrink: 0; line-height: 1.2; width: 16px; text-align: center; }
  .tip-box { background: #c8a96e12; border: 1px solid #c8a96e30; border-radius: 10px; padding: 10px 12px; margin-top: 12px; font-size: 12px; color: #c8a96e; line-height: 1.6; }
  .tip-box strong { display: block; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 3px; opacity: 0.7; }
  .error-box { background: #1a1815; border: 1px solid #3a2020; border-radius: 12px; padding: 16px; text-align: center; color: #c87070; font-size: 13px; margin-top: 16px; }

  /* SAVED PAGE */
  .page-header { margin-bottom: 24px; }
  .page-title { font-family: 'Playfair Display', serif; font-size: 26px; color: #f0ead6; margin-bottom: 4px; }
  .page-title em { font-style: italic; color: #c8a96e; }
  .page-sub { font-size: 13px; color: #7a7060; }
  .saved-grid { display: grid; gap: 12px; }
  .saved-card { background: #1a1815; border: 1px solid #2e2a22; border-radius: 16px; overflow: hidden; }
  .saved-card-header { padding: 14px 18px; border-bottom: 1px solid #2e2a22; cursor: pointer; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; transition: background 0.2s; }
  .saved-card-header:hover { background: #1f1c18; }
  .saved-date { font-size: 10px; color: #5a5040; margin-bottom: 3px; }
  .saved-name { font-family: 'Playfair Display', serif; font-size: 17px; color: #f0ead6; font-weight: 700; margin-bottom: 4px; }
  .saved-ing-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
  .saved-ing-tag { background: #0f0e0c; border: 1px solid #2e2a22; border-radius: 8px; padding: 2px 8px; font-size: 10.5px; color: #7a7060; }
  .saved-actions { display: flex; gap: 6px; flex-shrink: 0; align-items: flex-start; }
  .delete-btn { background: none; border: 1px solid #2e2a22; border-radius: 8px; padding: 4px 9px; font-size: 12px; color: #5a5040; cursor: pointer; transition: all 0.2s; }
  .delete-btn:hover { border-color: #c87070; color: #c87070; }
  .empty-state { text-align: center; padding: 56px 20px; color: #3a3528; font-size: 13px; font-style: italic; }
  .empty-state strong { display: block; font-family: 'Playfair Display', serif; font-size: 20px; color: #2e2a22; font-style: normal; margin-bottom: 6px; }

  /* SHOPPING LIST PAGE */
  .shopping-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .shopping-add-row { display: flex; gap: 8px; margin-bottom: 20px; }
  .shopping-input { flex: 1; background: #1a1815; border: 1px solid #2e2a22; border-radius: 10px; padding: 10px 14px; color: #f0ead6; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; transition: border-color 0.2s; }
  .shopping-input::placeholder { color: #3a3528; }
  .shopping-input:focus { border-color: #c8a96e; }
  .shopping-add-btn { background: #c8a96e; color: #0f0e0c; border: none; border-radius: 10px; padding: 10px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
  .shopping-add-btn:hover { background: #d4b87d; }
  .shopping-clear-btn { background: none; border: 1px solid #2e2a22; border-radius: 8px; padding: 7px 13px; font-size: 12px; color: #5a5040; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .shopping-clear-btn:hover { border-color: #c87070; color: #c87070; }
  .shopping-list { display: flex; flex-direction: column; gap: 6px; }
  .shopping-item { background: #1a1815; border: 1px solid #2e2a22; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; transition: all 0.2s; animation: tagIn 0.2s ease; }
  .shopping-item.checked { opacity: 0.45; }
  .shopping-check { width: 20px; height: 20px; border-radius: 6px; border: 1px solid #3a3528; background: none; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .shopping-check.on { background: #c8a96e; border-color: #c8a96e; color: #0f0e0c; font-size: 12px; }
  .shopping-text { flex: 1; font-size: 13px; color: #f0ead6; }
  .shopping-item.checked .shopping-text { text-decoration: line-through; color: #5a5040; }
  .shopping-source { font-size: 10px; color: #3a3528; margin-left: auto; }
  .shopping-del { background: none; border: none; color: #3a3528; cursor: pointer; font-size: 16px; line-height: 1; transition: color 0.15s; padding: 0; }
  .shopping-del:hover { color: #c87070; }
  .shopping-section-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #5a5040; font-weight: 500; margin: 16px 0 6px; }
  .shopping-count { font-size: 12px; color: #5a5040; }

  /* TOAST */
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #c8a96e; color: #0f0e0c; padding: 9px 18px; border-radius: 20px; font-size: 13px; font-weight: 500; z-index: 300; animation: toastIn 0.25s ease; white-space: nowrap; }
  @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
`;

// ─── DATA ──────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "viande", label: "🥩", name: "Viandes", items: [
    { name: "Poulet", variants: ["Poulet entier","Blanc de poulet","Cuisse de poulet","Aile de poulet","Poulet haché","Bouillon de poulet"] },
    { name: "Bœuf", variants: ["Bœuf haché","Entrecôte","Rumsteak","Côte de bœuf","Bœuf bourguignon","Pot-au-feu","Bavette","Paleron"] },
    { name: "Porc", variants: ["Côte de porc","Filet de porc","Porc haché","Travers de porc","Rôti de porc","Joue de porc"] },
    { name: "Agneau", variants: ["Gigot d'agneau","Côtelette d'agneau","Épaule d'agneau","Agneau haché"] },
    { name: "Veau", variants: ["Escalope de veau","Blanquette de veau","Osso buco","Veau haché"] },
    { name: "Canard", variants: ["Magret de canard","Confit de canard","Foie gras","Canard entier"] },
    { name: "Dinde", variants: ["Blanc de dinde","Escalope de dinde","Dinde entière","Dinde hachée"] },
    { name: "Lapin" }, { name: "Jambon", variants: ["Jambon blanc","Jambon cru","Jambon fumé"] },
    { name: "Lardons", variants: ["Lardons fumés","Lardons nature","Lard de poitrine"] },
    { name: "Saucisse", variants: ["Saucisse de Toulouse","Saucisse fumée","Knack","Chipolata","Saucisson"] },
    { name: "Merguez" }, { name: "Chorizo", variants: ["Chorizo doux","Chorizo fort","Chorizo à cuire"] },
  ]},
  { id: "poisson", label: "🐟", name: "Poissons", items: [
    { name: "Saumon", variants: ["Saumon frais","Saumon fumé","Saumon en boîte","Pavé de saumon"] },
    { name: "Cabillaud", variants: ["Cabillaud frais","Cabillaud surgelé","Morue salée"] },
    { name: "Thon", variants: ["Thon en boîte","Steak de thon","Thon frais"] },
    { name: "Sardines", variants: ["Sardines fraîches","Sardines en boîte"] },
    { name: "Crevettes", variants: ["Crevettes roses","Gambas","Crevettes décortiquées","Crevettes surgelées"] },
    { name: "Moules", variants: ["Moules fraîches","Moules marinières","Moules surgelées"] },
    { name: "Calamars" }, { name: "Dorade" }, { name: "Truite" },
    { name: "Maquereau", variants: ["Maquereau frais","Maquereau fumé","Maquereau en boîte"] },
    { name: "Homard" }, { name: "Poulpe" },
  ]},
  { id: "legume", label: "🥦", name: "Légumes", items: [
    { name: "Tomates", variants: ["Tomates rondes","Tomates cerises","Tomates allongées","Tomates séchées","Tomates concassées","Tomates pelées"] },
    { name: "Oignons", variants: ["Oignon jaune","Oignon rouge","Oignon blanc","Échalote","Cébette"] },
    { name: "Ail", variants: ["Ail frais","Ail en poudre","Ail confit","Ail fumé"] },
    { name: "Courgettes" }, { name: "Aubergines" },
    { name: "Poivrons", variants: ["Poivron rouge","Poivron vert","Poivron jaune","Poivron orange"] },
    { name: "Carottes" }, { name: "Pommes de terre", variants: ["Pommes de terre à chair ferme","Pommes de terre farineuses","Pommes de terre nouvelles","Patate douce"] },
    { name: "Épinards", variants: ["Épinards frais","Épinards surgelés","Pousses d'épinards"] },
    { name: "Champignons", variants: ["Champignons de Paris","Shiitake","Pleurotes","Cèpes","Girolles","Champignons séchés"] },
    { name: "Brocoli" }, { name: "Chou", variants: ["Chou blanc","Chou rouge","Chou frisé","Chou-fleur","Choux de Bruxelles","Chou kale"] },
    { name: "Poireaux" }, { name: "Haricots verts" }, { name: "Petits pois" },
    { name: "Céleri", variants: ["Céleri branche","Céleri rave"] },
    { name: "Betterave", variants: ["Betterave crue","Betterave cuite"] },
    { name: "Artichaut" }, { name: "Fenouil" }, { name: "Maïs" }, { name: "Asperges" }, { name: "Radis" },
  ]},
  { id: "fruit", label: "🍋", name: "Fruits", items: [
    { name: "Citron", variants: ["Citron jaune","Citron vert (lime)","Jus de citron","Zeste de citron"] },
    { name: "Orange", variants: ["Orange","Orange sanguine","Jus d'orange","Zeste d'orange","Clémentine","Mandarine"] },
    { name: "Pomme", variants: ["Pomme Golden","Pomme Granny","Pomme Gala","Compote de pomme"] },
    { name: "Poire" }, { name: "Banane" },
    { name: "Fraises" }, { name: "Framboises" },
    { name: "Mangue" }, { name: "Avocat" }, { name: "Ananas" },
    { name: "Raisin", variants: ["Raisin blanc","Raisin noir","Raisins secs"] },
    { name: "Pêche" }, { name: "Abricot" }, { name: "Figues" },
    { name: "Grenade" }, { name: "Kiwi" }, { name: "Melon" },
  ]},
  { id: "feculents", label: "🍚", name: "Féculents", items: [
    { name: "Riz", variants: ["Riz blanc","Riz basmati","Riz jasmin","Riz complet","Riz arborio (risotto)","Riz sauvage"] },
    { name: "Pâtes", variants: ["Spaghetti","Penne","Tagliatelles","Fusilli","Farfalle","Lasagnes","Gnocchi","Linguine"] },
    { name: "Lentilles", variants: ["Lentilles vertes","Lentilles rouges","Lentilles corail","Lentilles du Puy"] },
    { name: "Pois chiches", variants: ["Pois chiches secs","Pois chiches en boîte"] },
    { name: "Quinoa" }, { name: "Semoule", variants: ["Semoule fine","Semoule moyenne","Semoule grosse"] },
    { name: "Pain", variants: ["Pain de mie","Baguette","Pain complet","Pain pita","Tortilla","Pain naan"] },
    { name: "Farine", variants: ["Farine de blé T45","Farine T55","Farine complète","Farine de riz","Fécule de maïs","Maïzena"] },
    { name: "Haricots rouges", variants: ["Haricots rouges en boîte","Haricots blancs","Flageolets"] },
    { name: "Boulgour" }, { name: "Polenta" }, { name: "Tapioca" },
  ]},
  { id: "laitage", label: "🧀", name: "Laitages & Œufs", items: [
    { name: "Œufs", variants: ["Œufs entiers","Jaunes d'œuf","Blancs d'œuf","Œufs durs"] },
    { name: "Beurre", variants: ["Beurre doux","Beurre salé","Beurre demi-sel","Beurre clarifié"] },
    { name: "Crème fraîche", variants: ["Crème fraîche épaisse","Crème liquide entière","Crème légère","Crème de coco"] },
    { name: "Lait", variants: ["Lait entier","Lait demi-écrémé","Lait végétal","Lait de coco"] },
    { name: "Parmesan" }, { name: "Gruyère", variants: ["Gruyère râpé","Emmental","Comté","Beaufort"] },
    { name: "Mozzarella", variants: ["Mozzarella fraîche","Mozzarella râpée","Burrata"] },
    { name: "Feta" }, { name: "Fromage de chèvre", variants: ["Bûche de chèvre","Crottin de chavignol","Chèvre frais"] },
    { name: "Ricotta" }, { name: "Yaourt", variants: ["Yaourt nature","Yaourt grec","Labneh"] },
  ]},
  { id: "epices", label: "🌿", name: "Épices & Herbes", items: [
    { name: "Sel", variants: ["Sel fin","Fleur de sel","Sel de Guérande","Sel fumé"] },
    { name: "Poivre", variants: ["Poivre noir","Poivre blanc","Poivre rose","Poivre de Sichuan","Mélange 5 baies"] },
    { name: "Cumin" }, { name: "Paprika", variants: ["Paprika doux","Paprika fumé","Paprika fort"] },
    { name: "Curcuma" }, { name: "Cannelle" }, { name: "Gingembre", variants: ["Gingembre frais","Gingembre en poudre","Gingembre confit"] },
    { name: "Coriandre", variants: ["Coriandre fraîche","Coriandre en poudre","Graines de coriandre"] },
    { name: "Persil", variants: ["Persil plat","Persil frisé"] },
    { name: "Basilic", variants: ["Basilic frais","Basilic séché"] },
    { name: "Thym" }, { name: "Romarin" }, { name: "Laurier" }, { name: "Menthe" }, { name: "Estragon" },
    { name: "Safran" }, { name: "Piment", variants: ["Piment rouge","Piment vert","Piment d'Espelette","Piment en poudre","Tabasco"] },
    { name: "Noix de muscade" }, { name: "Curry", variants: ["Curry doux","Curry fort","Massalé","Colombo","Garam masala"] },
    { name: "Origan" },
  ]},
  { id: "condiments", label: "🫙", name: "Condiments", items: [
    { name: "Huile d'olive", variants: ["Huile d'olive vierge extra","Huile végétale","Huile de tournesol","Huile de sésame","Huile de noix"] },
    { name: "Moutarde", variants: ["Moutarde de Dijon","Moutarde à l'ancienne","Moutarde douce"] },
    { name: "Sauce soja", variants: ["Sauce soja salée","Sauce soja sucrée","Tamari"] },
    { name: "Vinaigre", variants: ["Vinaigre blanc","Vinaigre balsamique","Vinaigre de cidre","Vinaigre de riz"] },
    { name: "Ketchup" }, { name: "Mayonnaise" },
    { name: "Miel", variants: ["Miel liquide","Miel toutes fleurs","Miel d'acacia","Sirop d'érable"] },
    { name: "Sauce tomate", variants: ["Coulis de tomate","Concentré de tomate","Passata","Sauce bolognaise","Sauce arrabbiata"] },
    { name: "Tahini" }, { name: "Harissa" }, { name: "Crème balsamique" }, { name: "Nuoc-mâm" },
    { name: "Pesto", variants: ["Pesto verde","Pesto rosso","Pesto à la roquette"] },
  ]},
];

const MEAL_TYPES = ["Déjeuner", "Dîner", "Brunch", "Végétarien", "Rapide"];

function hashPassword(pw) {
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0;
  return h.toString(36);
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function RecipeApp() {
  // Auth
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Pages: 'app' | 'saved' | 'shopping'
  const [page, setPage] = useState("app");

  // Recipe app
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [mealType, setMealType] = useState("");
  const [persons, setPersons] = useState(2);
  const [recipes, setRecipes] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openCards, setOpenCards] = useState({});
  const [activeCategory, setActiveCategory] = useState("legume");
  const [browserSearch, setBrowserSearch] = useState("");
  const [savedIds, setSavedIds] = useState(new Set());
  const [cartIds, setCartIds] = useState(new Set());
  const [submenu, setSubmenu] = useState(null); // { name, variants }
  const [communityItems, setCommunityItems] = useState([]);
  const [suggesting, setSuggesting] = useState(false);

  // Saved
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedOpen, setSavedOpen] = useState({});
  const [savedLoading, setSavedLoading] = useState(false);

  // Shopping list
  const [shoppingItems, setShoppingItems] = useState([]);
  const [shopInput, setShopInput] = useState("");

  const [toast, setToast] = useState("");
  const inputRef = useRef(null);
  const shopInputRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  // Load community ingredients
  useEffect(() => {
    (async () => {
      try {
        const keys = await window.storage.list("community-ing:", true);
        const items = await Promise.all(
          (keys.keys || []).map(async k => {
            try { const r = await window.storage.get(k, true); return r ? JSON.parse(r.value).name : null; } catch { return null; }
          })
        );
        setCommunityItems(items.filter(Boolean));
      } catch {}
    })();
  }, []);

  // Load shopping list
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("shopping-list");
        if (r) setShoppingItems(JSON.parse(r.value));
      } catch {}
    })();
  }, []);

  const saveShoppingList = async (list) => {
    try { await window.storage.set("shopping-list", JSON.stringify(list)); } catch {}
  };

  // ── AUTH ────────────────────────────────────────────────────────────────────
  const handleAuth = async (mode) => {
    setAuthLoading(true); setAuthError("");
    const { username, password } = authForm;
    if (!username.trim() || !password.trim()) { setAuthError("Remplis tous les champs."); setAuthLoading(false); return; }
    if (password.length < 4) { setAuthError("Mot de passe trop court (min. 4 car.)."); setAuthLoading(false); return; }
    const key = `user:${username.toLowerCase()}`;
    const pwHash = hashPassword(password);
    try {
      if (mode === "signup") {
        let existing = null;
        try { existing = await window.storage.get(key); } catch { existing = null; }
        if (existing !== null) { setAuthError("Ce nom d'utilisateur est déjà pris."); setAuthLoading(false); return; }
        const saved = await window.storage.set(key, JSON.stringify({ username, pwHash, createdAt: Date.now() }));
        if (!saved) { setAuthError("Erreur lors de la création."); setAuthLoading(false); return; }
        setUser({ username }); setAuthModal(null); showToast(`Bienvenue, ${username} ! 🎉`);
      } else {
        let data = null;
        try { data = await window.storage.get(key); } catch { data = null; }
        if (!data) { setAuthError("Utilisateur introuvable."); setAuthLoading(false); return; }
        const profile = JSON.parse(data.value);
        if (profile.pwHash !== pwHash) { setAuthError("Mot de passe incorrect."); setAuthLoading(false); return; }
        setUser({ username }); setAuthModal(null); showToast(`Bon retour, ${username} ! 👨‍🍳`);
      }
    } catch (e) { setAuthError("Erreur : " + (e?.message || "réessaie.")); }
    setAuthLoading(false);
  };

  const logout = () => { setUser(null); setPage("app"); setSavedRecipes([]); };

  // ── SAVED RECIPES ───────────────────────────────────────────────────────────
  const loadSavedRecipes = async () => {
    if (!user) return;
    setSavedLoading(true);
    try {
      const keys = await window.storage.list(`saved:${user.username}:`);
      const items = await Promise.all(
        (keys.keys || []).map(async k => {
          try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; }
        })
      );
      setSavedRecipes(items.filter(Boolean).sort((a, b) => b.savedAt - a.savedAt));
    } catch {}
    setSavedLoading(false);
  };

  const saveRecipe = async (recipe) => {
    if (!user) { setAuthModal("login"); return; }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const entry = { id, recipe, ingredients, persons, savedAt: Date.now() };
    try {
      await window.storage.set(`saved:${user.username}:${id}`, JSON.stringify(entry));
      setSavedIds(prev => new Set([...prev, recipe.name]));
      showToast(`« ${recipe.name} » sauvegardée ✓`);
    } catch { showToast("Erreur lors de la sauvegarde."); }
  };

  const deleteRecipe = async (entry) => {
    try {
      await window.storage.delete(`saved:${user.username}:${entry.id}`);
      setSavedRecipes(prev => prev.filter(r => r.id !== entry.id));
      showToast("Recette supprimée.");
    } catch {}
  };

  useEffect(() => { if (page === "saved" && user) loadSavedRecipes(); }, [page, user]);

  // ── SHOPPING LIST ───────────────────────────────────────────────────────────
  const addToShoppingList = (items, source = "Manuel") => {
    setShoppingItems(prev => {
      const newItems = items
        .filter(i => !prev.some(p => p.text.toLowerCase() === i.toLowerCase()))
        .map(i => ({ id: Date.now() + Math.random(), text: i, checked: false, source }));
      const updated = [...prev, ...newItems];
      saveShoppingList(updated);
      return updated;
    });
  };

  const addRecipeToCart = (recipe) => {
    const items = recipe.ingredients || [];
    addToShoppingList(items, recipe.name);
    setCartIds(prev => new Set([...prev, recipe.name]));
    showToast(`${items.length} ingrédients ajoutés à la liste 🛒`);
    setPage("shopping");
  };

  const toggleShoppingItem = (id) => {
    setShoppingItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
      saveShoppingList(updated); return updated;
    });
  };

  const deleteShoppingItem = (id) => {
    setShoppingItems(prev => { const updated = prev.filter(i => i.id !== id); saveShoppingList(updated); return updated; });
  };

  const clearChecked = () => {
    setShoppingItems(prev => { const updated = prev.filter(i => !i.checked); saveShoppingList(updated); return updated; });
  };

  const addShopManual = () => {
    if (!shopInput.trim()) return;
    addToShoppingList([shopInput.trim()], "Manuel");
    setShopInput("");
    shopInputRef.current?.focus();
  };

  // ── INGREDIENT LOGIC ────────────────────────────────────────────────────────
  const addIngredient = (ing) => {
    const name = (ing || input).trim();
    if (!name) return;
    setIngredients(prev => prev.some(i => i.toLowerCase() === name.toLowerCase()) ? prev : [...prev, name]);
    if (!ing) { setInput(""); inputRef.current?.focus(); }
  };

  const toggleIngredient = (name) => {
    if (ingredients.some(i => i.toLowerCase() === name.toLowerCase()))
      setIngredients(prev => prev.filter(i => i.toLowerCase() !== name.toLowerCase()));
    else addIngredient(name);
  };

  const handleIngClick = (item) => {
    if (item.variants && item.variants.length > 0) setSubmenu(item);
    else toggleIngredient(item.name);
  };

  const removeIngredient = (idx) => setIngredients(prev => prev.filter((_, i) => i !== idx));
  const toggleCard = (idx) => setOpenCards(prev => ({ ...prev, [idx]: !prev[idx] }));

  const allBaseItems = CATEGORIES.flatMap(c => c.items.map(i => (typeof i === "string" ? i : i.name)));
  const allItems = [...new Set([...allBaseItems, ...communityItems])];
  const currentCatItems = CATEGORIES.find(c => c.id === activeCategory)?.items || [];

  const filteredItems = browserSearch.trim()
    ? allItems.filter(i => i.toLowerCase().includes(browserSearch.toLowerCase())).map(name => {
        const found = CATEGORIES.flatMap(c => c.items).find(i => (typeof i === "string" ? i : i.name).toLowerCase() === name.toLowerCase());
        return found || { name };
      })
    : [
        ...currentCatItems,
        ...communityItems.filter(ci => !allBaseItems.some(b => b.toLowerCase() === ci.toLowerCase())).map(name => ({ name }))
      ];

  const searchTermIsNew = browserSearch.trim().length > 1 &&
    !allItems.some(i => i.toLowerCase() === browserSearch.trim().toLowerCase());

  const suggestIngredient = async (name) => {
    setSuggesting(true);
    const key = `community-ing:${name.toLowerCase().replace(/\s+/g, "-")}`;
    try {
      await window.storage.set(key, JSON.stringify({ name, addedAt: Date.now(), addedBy: user?.username || "anonyme" }), true);
      setCommunityItems(prev => prev.includes(name) ? prev : [...prev, name]);
      showToast(`« ${name} » ajouté à la liste ! 🌿`);
      setBrowserSearch("");
    } catch { showToast("Erreur lors de l'ajout."); }
    setSuggesting(false);
  };

  // ── GENERATE ────────────────────────────────────────────────────────────────
  const generateRecipes = async () => {
    if (ingredients.length === 0) return;
    setLoading(true); setError(""); setRecipes(null); setWarnings([]); setSavedIds(new Set()); setCartIds(new Set());
    const personLabel = persons === 1 ? "1 personne" : `${persons} personnes`;
    const prompt = `Tu es un chef expert. Ingrédients disponibles : ${ingredients.join(", ")}.${mealType ? ` Type de repas : ${mealType}.` : ""} Portions : ${personLabel}.

Génère EXACTEMENT 3 recettes INDÉPENDANTES (pas un menu — 3 plats distincts qu'on peut faire séparément). Adapte les quantités pour ${personLabel}. Détecte les incompatibilités entre ingrédients.

Réponds UNIQUEMENT en JSON valide sans texte autour :
{"clashes":[{"pair":"A+B","reason":"raison courte"}],"recipes":[{"name":"Nom","category":"type","time":"X min","description":"1 phrase.","ingredients":["quantité ingrédient"],"steps":["étape"],"tip":"conseil"}]}
clashes:[] si aucune incompatibilité.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setWarnings(parsed.clashes || []);
      setRecipes(parsed.recipes);
      setOpenCards({ 0: true });
    } catch { setError("Une erreur s'est produite. Réessaie."); }
    setLoading(false);
  };

  const clashSet = new Set(warnings.flatMap(w => w.pair.split(/[+&,]/).map(s => s.trim().toLowerCase())));
  const shoppingCount = shoppingItems.filter(i => !i.checked).length;

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="noise" />

        {/* TOP BAR */}
        <div className="topbar">
          <nav className="nav">
            <div className="nav-logo" onClick={() => setPage("app")}>Chef<em>IA</em></div>
            <div className="nav-center">
              <button className={`nav-tab ${page === "app" ? "active" : ""}`} onClick={() => setPage("app")}>🍳 Recettes</button>
              {user && <button className={`nav-tab ${page === "saved" ? "active" : ""}`} onClick={() => setPage("saved")}>🔖 Sauvegardées</button>}
              <button className={`nav-tab ${page === "shopping" ? "active" : ""}`} onClick={() => setPage("shopping")}>
                🛒 Liste de courses{shoppingCount > 0 && <span className="badge">{shoppingCount}</span>}
              </button>
            </div>
            <div className="nav-right">
              {user ? (
                <>
                  <div className="nav-avatar">{user.username[0].toUpperCase()}</div>
                  <span style={{ fontSize: 13, color: "#b0a490" }}>{user.username}</span>
                  <button className="nav-btn" onClick={logout}>Déco.</button>
                </>
              ) : (
                <>
                  <button className="nav-btn" onClick={() => { setAuthModal("login"); setAuthError(""); setAuthForm({ username: "", password: "" }); }}>Connexion</button>
                  <button className="nav-btn primary" onClick={() => { setAuthModal("signup"); setAuthError(""); setAuthForm({ username: "", password: "" }); }}>S'inscrire</button>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* AUTH MODAL */}
        {authModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setAuthModal(null)}>
            <div className="modal">
              <button className="modal-close" onClick={() => setAuthModal(null)}>×</button>
              <div className="modal-title">{authModal === "login" ? "Bon retour 👋" : "Créer un compte"}</div>
              <div className="modal-sub">{authModal === "login" ? "Connecte-toi pour retrouver tes recettes." : "Sauvegarde tes recettes préférées."}</div>
              {authError && <div className="form-error">{authError}</div>}
              <div className="form-field">
                <label className="form-label">Nom d'utilisateur</label>
                <input className="form-input" placeholder="ex: jean_cuisine" value={authForm.username}
                  onChange={e => setAuthForm(f => ({ ...f, username: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleAuth(authModal)} />
              </div>
              <div className="form-field">
                <label className="form-label">Mot de passe</label>
                <input className="form-input" type="password" placeholder="••••••••" value={authForm.password}
                  onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleAuth(authModal)} />
              </div>
              <button className="form-btn" disabled={authLoading} onClick={() => handleAuth(authModal)}>
                {authLoading ? "Chargement…" : authModal === "login" ? "Se connecter" : "Créer mon compte"}
              </button>
              <div className="form-switch">
                {authModal === "login"
                  ? <>Pas de compte ?{" "}<button onClick={() => { setAuthModal("signup"); setAuthError(""); }}>S'inscrire</button></>
                  : <>Déjà un compte ?{" "}<button onClick={() => { setAuthModal("login"); setAuthError(""); }}>Se connecter</button></>}
              </div>
            </div>
          </div>
        )}

        {/* SUBMENU for variants */}
        {submenu && (
          <div className="submenu-overlay" onClick={e => e.target === e.currentTarget && setSubmenu(null)}>
            <div className="submenu">
              <div className="submenu-title">{submenu.name}</div>
              <div className="submenu-sub">Choisis une ou plusieurs variantes</div>
              <div className="submenu-items">
                <button className={`submenu-item ${ingredients.some(i => i.toLowerCase() === submenu.name.toLowerCase()) ? "selected" : ""}`}
                  onClick={() => toggleIngredient(submenu.name)}>
                  {submenu.name} (général)
                </button>
                {submenu.variants.map(v => (
                  <button key={v} className={`submenu-item ${ingredients.some(i => i.toLowerCase() === v.toLowerCase()) ? "selected" : ""}`}
                    onClick={() => toggleIngredient(v)}>{v}</button>
                ))}
              </div>
              <button className="submenu-close" onClick={() => setSubmenu(null)}>Fermer</button>
            </div>
          </div>
        )}

        {/* ── PAGE: SHOPPING ────────────────────────────────────────────────── */}
        {page === "shopping" && (
          <div className="main" style={{ paddingTop: 28 }}>
            <div className="shopping-header">
              <div className="page-header">
                <div className="page-title">Liste de <em>courses</em></div>
                <div className="page-sub">{shoppingItems.length === 0 ? "Ta liste est vide." : `${shoppingItems.filter(i => !i.checked).length} article${shoppingItems.filter(i => !i.checked).length > 1 ? "s" : ""} restant${shoppingItems.filter(i => !i.checked).length > 1 ? "s" : ""}`}</div>
              </div>
              {shoppingItems.some(i => i.checked) && (
                <button className="shopping-clear-btn" onClick={clearChecked}>Supprimer cochés</button>
              )}
            </div>

            <div className="shopping-add-row">
              <input ref={shopInputRef} className="shopping-input" placeholder="Ajouter un article manuellement…"
                value={shopInput} onChange={e => setShopInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addShopManual()} />
              <button className="shopping-add-btn" onClick={addShopManual}>Ajouter</button>
            </div>

            {shoppingItems.length === 0 ? (
              <div className="empty-state">
                <strong>Aucun article</strong>
                Génère une recette et clique sur 🛒 pour ajouter ses ingrédients ici, ou ajoute manuellement.
              </div>
            ) : (
              <div className="shopping-list">
                {["Manuel", ...new Set(shoppingItems.filter(i => i.source !== "Manuel").map(i => i.source))].map(source => {
                  const sourceItems = shoppingItems.filter(i => i.source === source);
                  if (sourceItems.length === 0) return null;
                  return (
                    <div key={source}>
                      <div className="shopping-section-label">{source === "Manuel" ? "Ajoutés manuellement" : `Recette : ${source}`}</div>
                      {sourceItems.map(item => (
                        <div key={item.id} className={`shopping-item ${item.checked ? "checked" : ""}`}>
                          <button className={`shopping-check ${item.checked ? "on" : ""}`} onClick={() => toggleShoppingItem(item.id)}>
                            {item.checked ? "✓" : ""}
                          </button>
                          <span className="shopping-text">{item.text}</span>
                          <button className="shopping-del" onClick={() => deleteShoppingItem(item.id)}>×</button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PAGE: SAVED ───────────────────────────────────────────────────── */}
        {page === "saved" && (
          <div className="main" style={{ paddingTop: 28 }}>
            <div className="page-header">
              <div className="page-title">Mes <em>recettes</em></div>
              <div className="page-sub">Toutes les recettes sauvegardées.</div>
            </div>
            {savedLoading ? (
              <div className="loading"><div className="loader-ring" /><p>Chargement…</p></div>
            ) : savedRecipes.length === 0 ? (
              <div className="empty-state"><strong>Aucune recette sauvegardée</strong>Génère des recettes et clique sur 🔖 pour les retrouver ici.</div>
            ) : (
              <div className="saved-grid">
                {savedRecipes.map((entry, i) => (
                  <div key={entry.id} className="saved-card">
                    <div className="saved-card-header" onClick={() => setSavedOpen(p => ({ ...p, [i]: !p[i] }))}>
                      <div style={{ flex: 1 }}>
                        <div className="saved-date">{new Date(entry.savedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · {entry.recipe.time}{entry.persons ? ` · ${entry.persons} pers.` : ""}</div>
                        <div className="saved-name">{entry.recipe.name}</div>
                        <div className="saved-ing-tags">{entry.ingredients?.map((ing, j) => <span key={j} className="saved-ing-tag">{ing}</span>)}</div>
                      </div>
                      <div className="saved-actions">
                        <button className="cart-btn" onClick={e => { e.stopPropagation(); addRecipeToCart(entry.recipe); }}>🛒</button>
                        <button className="delete-btn" onClick={e => { e.stopPropagation(); deleteRecipe(entry); }}>🗑</button>
                        <span className={`chevron ${savedOpen[i] ? "open" : ""}`}>⌄</span>
                      </div>
                    </div>
                    {savedOpen[i] && (
                      <div className="recipe-body open">
                        <div className="recipe-cols">
                          <div>
                            <p className="recipe-section-title">Ingrédients</p>
                            <ul className="ingredient-list">{entry.recipe.ingredients?.map((ing, j) => <li key={j}>{ing}</li>)}</ul>
                          </div>
                          <div>
                            <p className="recipe-section-title">Préparation</p>
                            <ol className="steps-list">{entry.recipe.steps?.map((s, j) => <li key={j}>{s}</li>)}</ol>
                            {entry.recipe.tip && <div className="tip-box"><strong>Conseil du chef</strong>{entry.recipe.tip}</div>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PAGE: APP ─────────────────────────────────────────────────────── */}
        {page === "app" && (
          <>
            <div className="hero">
              <p className="hero-label">Cuisine Intelligente</p>
              <h1 className="hero-title">Qu'est-ce qu'on<br /><em>cuisine</em> ce soir ?</h1>
              <p className="hero-sub">Choisis tes ingrédients, je m'occupe du reste.</p>
            </div>

            <div className="main">
              <div className="layout">
                {/* LEFT browser */}
                <div className="browser-panel">
                  <div className="browser-search">
                    <input placeholder="🔍 Rechercher un ingrédient…" value={browserSearch} onChange={e => setBrowserSearch(e.target.value)} />
                  </div>
                  {!browserSearch && (
                    <div className="cat-tabs">
                      {CATEGORIES.map(cat => (
                        <button key={cat.id} className={`cat-tab ${activeCategory === cat.id ? "active" : ""}`}
                          onClick={() => setActiveCategory(cat.id)} title={cat.name}>{cat.label}</button>
                      ))}
                    </div>
                  )}
                  <div className="ing-grid">
                    {filteredItems.map(item => {
                      const name = typeof item === "string" ? item : item.name;
                      const hasVariants = item.variants && item.variants.length > 0;
                      const isCommunity = communityItems.includes(name);
                      const isSelected = ingredients.some(i => i.toLowerCase() === name.toLowerCase()) ||
                        (hasVariants && item.variants.some(v => ingredients.some(i => i.toLowerCase() === v.toLowerCase())));
                      return (
                        <button key={name} className={`ing-btn ${hasVariants ? "has-sub" : ""} ${isSelected ? "selected" : ""}`}
                          onClick={() => hasVariants ? setSubmenu(item) : toggleIngredient(name)}>
                          {name}
                          {hasVariants && <span className="ing-arrow">▸</span>}
                          {isCommunity && <span className="community-badge">+</span>}
                        </button>
                      );
                    })}
                    {searchTermIsNew && (
                      <div className="suggest-box">
                        <div className="suggest-label"><strong>« {browserSearch.trim()} »</strong> n'existe pas encore.<br />Suggère-le à la communauté !</div>
                        <button className="suggest-btn" disabled={suggesting} onClick={() => suggestIngredient(browserSearch.trim())}>
                          {suggesting ? "Ajout…" : `✦ Ajouter « ${browserSearch.trim()} »`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="right-panel">
                  <div className="section-card">
                    <h2 className="section-title"><span />Mes ingrédients sélectionnés</h2>
                    <div className="input-row">
                      <input ref={inputRef} className="ingredient-input" placeholder="Ou tapez manuellement…"
                        value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addIngredient()} />
                      <button className="add-btn" onClick={() => addIngredient()}>+</button>
                    </div>
                    <div className="tags">
                      {ingredients.length === 0
                        ? <span className="empty-tags">Clique sur les ingrédients à gauche</span>
                        : ingredients.map((ing, i) => (
                          <div key={i} className={`tag ${clashSet.has(ing.toLowerCase()) ? "clash" : ""}`}>
                            {ing}<button className="tag-remove" onClick={() => removeIngredient(i)}>×</button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="section-card">
                    <h2 className="section-title"><span />Type de repas</h2>
                    <div className="options-row">
                      {MEAL_TYPES.map(t => (
                        <button key={t} className={`option-chip ${mealType === t ? "active" : ""}`}
                          onClick={() => setMealType(p => p === t ? "" : t)}>{t}</button>
                      ))}
                    </div>
                  </div>

                  <div className="section-card">
                    <h2 className="section-title"><span />Nombre de personnes</h2>
                    <div className="persons-row">
                      <span className="persons-label">
                        {persons === 1 ? "Solo 🧑‍🍳" : persons <= 2 ? "Duo" : persons <= 6 ? `${persons} pers. 👨‍👩‍👧` : persons <= 20 ? `${persons} pers. 🎉` : `${persons} pers. 🍽️`}
                      </span>
                      <div className="persons-ctrl">
                        <button className="persons-btn" onClick={() => setPersons(p => Math.max(1, p - 1))} disabled={persons <= 1}>−</button>
                        <input
                          className="persons-count-input"
                          type="number"
                          min="1" max="100"
                          value={persons}
                          onChange={e => {
                            const v = parseInt(e.target.value);
                            if (!isNaN(v) && v >= 1 && v <= 100) setPersons(v);
                            else if (e.target.value === "") setPersons(1);
                          }}
                        />
                        <button className="persons-btn" onClick={() => setPersons(p => Math.min(100, p + 1))} disabled={persons >= 100}>+</button>
                      </div>
                    </div>
                    <div className="persons-presets">
                      {[1, 2, 4, 6, 10, 20, 50, 100].map(n => (
                        <button key={n} className={`persons-preset ${persons === n ? "active" : ""}`} onClick={() => setPersons(n)}>
                          {n === 1 ? "Solo" : n === 2 ? "Duo" : n === 4 ? "Famille" : `${n}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="generate-btn" onClick={generateRecipes} disabled={ingredients.length === 0 || loading}>
                    {loading ? "Génération en cours…" : `✦ Trouver des recettes · ${persons} pers.`}
                  </button>
                </div>
              </div>

              {loading && <div className="loading"><div className="loader-ring" /><p>Le chef réfléchit…</p></div>}
              {error && <div className="error-box">{error}</div>}

              {warnings.length > 0 && (
                <div className="warnings-box">
                  <div className="warnings-title">Associations déconseillées</div>
                  {warnings.map((w, i) => (
                    <div key={i} className="warning-item"><span className="warning-pair">{w.pair}</span><span>{w.reason}</span></div>
                  ))}
                </div>
              )}

              {recipes && (
                <div className="recipes-grid">
                  {recipes.map((recipe, i) => (
                    <div key={i} className="recipe-card">
                      <div className="recipe-header" onClick={() => toggleCard(i)}>
                        <div style={{ flex: 1 }}>
                          <div className="recipe-meta">
                            <span className="recipe-badge">{recipe.category}</span>
                            <span className="recipe-time">⏱ {recipe.time}</span>
                          </div>
                          <div className="recipe-name">{recipe.name}</div>
                          <div className="recipe-desc">{recipe.description}</div>
                        </div>
                        <div className="recipe-header-right">
                          <button className={`cart-btn ${cartIds.has(recipe.name) ? "added" : ""}`}
                            onClick={e => { e.stopPropagation(); addRecipeToCart(recipe); }}>
                            {cartIds.has(recipe.name) ? "✓ Ajouté" : "🛒"}
                          </button>
                          <button className={`save-btn ${savedIds.has(recipe.name) ? "saved" : ""}`}
                            onClick={e => { e.stopPropagation(); saveRecipe(recipe); }}>
                            {savedIds.has(recipe.name) ? "✓" : user ? "🔖" : "🔒"}
                          </button>
                          <span className={`chevron ${openCards[i] ? "open" : ""}`}>⌄</span>
                        </div>
                      </div>
                      <div className={`recipe-body ${openCards[i] ? "open" : ""}`}>
                        <div className="recipe-cols">
                          <div>
                            <p className="recipe-section-title">Ingrédients</p>
                            <ul className="ingredient-list">{recipe.ingredients?.map((ing, j) => <li key={j}>{ing}</li>)}</ul>
                          </div>
                          <div>
                            <p className="recipe-section-title">Préparation</p>
                            <ol className="steps-list">{recipe.steps?.map((s, j) => <li key={j}>{s}</li>)}</ol>
                            {recipe.tip && <div className="tip-box"><strong>Conseil du chef</strong>{recipe.tip}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
