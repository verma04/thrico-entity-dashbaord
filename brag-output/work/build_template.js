const fs = require('fs');
const path = require('path');

const thricoAiSvg = fs.readFileSync(path.join(__dirname, '../../public/thrico_ai.svg'), 'utf8');
const thricoLogoSvg = fs.readFileSync(path.join(__dirname, '../../public/thrico-logo.svg'), 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Thrico Launch Video</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  body {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background-color: #05070B;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #F8FAFC;
    position: relative;
    user-select: none;
  }

  /* Ambient Canvas Lighting */
  .bg-glow-1 {
    position: absolute;
    width: 1000px;
    height: 1000px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(253, 85, 49, 0.18) 0%, rgba(253, 85, 49, 0) 70%);
    top: -250px;
    left: -250px;
    pointer-events: none;
    filter: blur(90px);
  }

  .bg-glow-2 {
    position: absolute;
    width: 1100px;
    height: 1100px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(13, 99, 244, 0.22) 0%, rgba(13, 99, 244, 0) 70%);
    bottom: -350px;
    right: -250px;
    pointer-events: none;
    filter: blur(100px);
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
    background-size: 64px 64px;
    pointer-events: none;
  }

  .stage {
    width: 1920px;
    height: 1080px;
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .scene {
    position: absolute;
    inset: 0;
    width: 1920px;
    height: 1080px;
    opacity: 0;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform-origin: center center;
  }

  /* --- SCENE 1 --- */
  #scene1 {
    z-index: 10;
  }
  .hook-icon-wrap {
    width: 240px;
    height: 240px;
    position: relative;
    margin-bottom: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hook-icon-wrap svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 50px rgba(13, 99, 244, 0.7)) drop-shadow(0 0 80px rgba(253, 85, 49, 0.5));
  }
  .hook-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 22px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.14);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fd5531;
    margin-bottom: 24px;
    backdrop-filter: blur(12px);
  }
  .hook-pill-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0d63f4;
    box-shadow: 0 0 10px #0d63f4;
  }
  .hook-title {
    font-size: 72px;
    font-weight: 800;
    line-height: 1.12;
    text-align: center;
    letter-spacing: -0.035em;
    max-width: 1300px;
    background: linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 22px;
  }
  .hook-strike {
    color: #64748B;
    text-decoration: line-through;
    text-decoration-color: #fd5531;
    text-decoration-thickness: 5px;
    margin-right: 14px;
  }
  .hook-sub {
    font-size: 26px;
    font-weight: 500;
    color: #94A3B8;
    text-align: center;
    max-width: 960px;
    line-height: 1.45;
  }

  /* --- DASHBOARD SHELL --- */
  .dash-frame {
    width: 1700px;
    height: 940px;
    background: #0A0E17;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .dash-topbar {
    height: 68px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    background: rgba(14, 20, 32, 0.7);
    backdrop-filter: blur(20px);
  }
  .dash-topbar-left {
    display: flex;
    align-items: center;
    gap: 22px;
  }
  .dash-topbar-logo {
    height: 32px;
    display: flex;
    align-items: center;
  }
  .dash-topbar-logo svg {
    height: 30px;
    width: auto;
  }
  .entity-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #E2E8F0;
  }
  .entity-badge-icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: linear-gradient(135deg, #fd5531, #0d63f4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
  }
  .dash-topbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .topbar-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 8px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #34D399;
    font-size: 13px;
    font-weight: 700;
  }
  .status-pulsing-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10B981;
    box-shadow: 0 0 10px #10B981;
  }
  .topbar-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid #0d63f4;
    background: linear-gradient(135deg, #1E293B, #0F172A);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #FFF;
  }

  .dash-body {
    display: flex;
    flex: 1;
    height: calc(100% - 68px);
  }

  .dash-sidebar {
    width: 240px;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(10, 14, 23, 0.5);
    padding: 22px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #94A3B8;
  }
  .sidebar-item.active {
    background: rgba(13, 99, 244, 0.16);
    color: #60A5FA;
    border: 1px solid rgba(13, 99, 244, 0.35);
    font-weight: 700;
  }
  .sidebar-item svg {
    width: 18px;
    height: 18px;
  }

  .dash-main {
    flex: 1;
    padding: 26px 34px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    overflow: hidden;
  }

  /* --- KPI CARDS --- */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
  .kpi-card {
    background: rgba(18, 25, 40, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  .kpi-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .kpi-title {
    font-size: 13px;
    font-weight: 700;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .kpi-icon-pill {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
  }
  .kpi-val {
    font-size: 38px;
    font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: -0.035em;
    color: #FFFFFF;
    margin-bottom: 6px;
  }
  .kpi-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
  }
  .kpi-trend-pos {
    color: #34D399;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .kpi-subtext {
    color: #64748B;
  }

  /* --- AREA CHART PANEL --- */
  .chart-panel {
    background: rgba(18, 25, 40, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 22px 28px;
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
  }
  .chart-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .chart-title {
    font-size: 18px;
    font-weight: 700;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .chart-period-picker {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 3px;
  }
  .chart-period-btn {
    padding: 4px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #94A3B8;
  }
  .chart-period-btn.active {
    background: #0d63f4;
    color: #FFFFFF;
  }
  .chart-canvas-wrap {
    flex: 1;
    width: 100%;
    position: relative;
  }
  .chart-canvas-wrap svg {
    width: 100%;
    height: 100%;
  }

  .chart-tooltip-badge {
    position: absolute;
    top: 22px;
    right: 40px;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid #fd5531;
    box-shadow: 0 10px 30px rgba(253, 85, 49, 0.3);
    padding: 8px 14px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    color: #FFF;
    z-index: 10;
  }

  /* --- SCENE 3: MODULAR ECOSYSTEM --- */
  .modules-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 20px;
    width: 100%;
    height: 100%;
  }
  .module-card {
    background: rgba(18, 25, 40, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    transition: all 0.3s;
  }
  .module-card.highlight {
    background: rgba(13, 99, 244, 0.15);
    border-color: rgba(13, 99, 244, 0.6);
    box-shadow: 0 0 40px rgba(13, 99, 244, 0.3);
  }
  .module-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .module-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
    margin-bottom: 14px;
  }
  .module-title {
    font-size: 20px;
    font-weight: 700;
    color: #FFF;
    margin-bottom: 6px;
  }
  .module-desc {
    font-size: 14px;
    color: #94A3B8;
    line-height: 1.45;
    margin-bottom: 12px;
  }
  .module-tag-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }
  .mini-chip {
    padding: 2px 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 11px;
    font-weight: 600;
    color: #CBD5E1;
  }
  .module-stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 13px;
  }
  .module-stat-val {
    font-weight: 700;
    color: #F8FAFC;
    font-family: 'JetBrains Mono', monospace;
  }
  .module-stat-tag {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
  }

  /* --- SCENE 4: IMPACT & LEADERBOARDS --- */
  .impact-container {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 24px;
    width: 100%;
    height: 100%;
  }
  .leaderboard-panel {
    background: rgba(18, 25, 40, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
  }
  .leaderboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .leaderboard-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .leader-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  .leader-item.top-rank {
    background: linear-gradient(90deg, rgba(253, 85, 49, 0.14), rgba(13, 99, 244, 0.14));
    border: 1px solid rgba(253, 85, 49, 0.35);
  }
  .leader-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .leader-rank {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 13px;
  }
  .rank-1 { background: #F59E0B; color: #000; }
  .rank-2 { background: #94A3B8; color: #000; }
  .rank-3 { background: #D97706; color: #FFF; }
  .leader-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fd5531, #0d63f4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: #FFF;
    font-size: 15px;
  }
  .leader-name {
    font-weight: 700;
    font-size: 16px;
    color: #FFF;
  }
  .leader-role {
    font-size: 13px;
    color: #94A3B8;
  }
  .leader-karma {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 800;
    font-size: 16px;
    color: #F59E0B;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .celebration-toast {
    position: absolute;
    top: 36px;
    right: 40px;
    background: rgba(15, 23, 42, 0.95);
    border: 1.5px solid #F59E0B;
    box-shadow: 0 20px 60px rgba(245, 158, 11, 0.35);
    border-radius: 14px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 50;
    backdrop-filter: blur(20px);
  }
  .toast-icon {
    font-size: 30px;
  }
  .toast-text-title {
    font-weight: 800;
    color: #FFF;
    font-size: 15px;
    margin-bottom: 2px;
  }
  .toast-text-desc {
    font-size: 13px;
    color: #CBD5E1;
  }

  /* Live Activity Feed Rows */
  .live-feed-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.03);
    font-size: 12px;
    color: #CBD5E1;
  }
  .live-feed-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10B981;
  }

  /* --- SCENE 5: OUTRO --- */
  #scene5 {
    z-index: 10;
  }
  .outro-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 22px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #60A5FA;
    margin-bottom: 26px;
  }
  .outro-logo-wrap {
    width: 440px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .outro-logo-wrap svg {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 0 50px rgba(13, 99, 244, 0.65));
  }
  .outro-h1 {
    font-size: 66px;
    font-weight: 800;
    line-height: 1.1;
    text-align: center;
    letter-spacing: -0.03em;
    background: linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 18px;
  }
  .outro-sub {
    font-size: 24px;
    font-weight: 500;
    color: #94A3B8;
    text-align: center;
    max-width: 860px;
    line-height: 1.45;
    margin-bottom: 38px;
  }
  .outro-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 18px 42px;
    border-radius: 14px;
    background: linear-gradient(135deg, #fd5531, #0d63f4);
    box-shadow: 0 12px 45px rgba(13, 99, 244, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.25);
    font-size: 19px;
    font-weight: 800;
    color: #FFF;
    text-decoration: none;
    letter-spacing: -0.01em;
  }
  .outro-url {
    margin-top: 26px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    color: #64748B;
    letter-spacing: 0.12em;
  }

  /* Caption Bar */
  .caption-bar {
    position: absolute;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(11, 15, 23, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.14);
    padding: 10px 26px;
    border-radius: 9999px;
    font-size: 16px;
    font-weight: 600;
    color: #E2E8F0;
    backdrop-filter: blur(16px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 99;
  }
  .caption-indicator {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fd5531;
    box-shadow: 0 0 8px #fd5531;
  }

  .mouse-cursor {
    position: absolute;
    width: 28px;
    height: 28px;
    z-index: 100;
    pointer-events: none;
    opacity: 0;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.7));
  }
</style>
</head>
<body>

<div class="bg-glow-1" id="glow1"></div>
<div class="bg-glow-2" id="glow2"></div>
<div class="bg-grid"></div>

<div class="stage" id="stage">

  <!-- SCENE 1: THE HOOK (0 - 3s) -->
  <div class="scene" id="scene1">
    <div class="hook-pill">
      <div class="hook-pill-dot"></div>
      The Community Operating System
    </div>
    <div class="hook-icon-wrap" id="hookIcon">
      ${thricoAiSvg}
    </div>
    <div class="hook-title" id="hookTitle">
      <span class="hook-strike" id="hookStrike">DISCORD + SPREADSHEETS</span>
      <br>
      THE ALL-IN-ONE COMMUNITY OS
    </div>
    <div class="hook-sub" id="hookSub">
      Unite forums, job boards, 1-on-1 mentorship, karma rewards, and real-time pulse.
    </div>
  </div>

  <!-- SCENE 2: COMMAND CENTER (3 - 7.5s) -->
  <div class="scene" id="scene2">
    <div class="dash-frame" id="dashFrame2">
      <div class="dash-topbar">
        <div class="dash-topbar-left">
          <div class="dash-topbar-logo">${thricoLogoSvg}</div>
          <div class="entity-badge">
            <div class="entity-badge-icon">T</div>
            Global Alumni & Tech Network
          </div>
        </div>
        <div class="dash-topbar-right">
          <div class="topbar-status">
            <div class="status-pulsing-dot"></div>
            1,420 Active Now
          </div>
          <div class="topbar-avatar">AD</div>
        </div>
      </div>
      <div class="dash-body">
        <div class="dash-sidebar">
          <div class="sidebar-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Command Center
          </div>
          <div class="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Communities
          </div>
          <div class="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            Discussions
          </div>
          <div class="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Job Board
          </div>
          <div class="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
            Mentorship
          </div>
          <div class="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            Gamification
          </div>
        </div>
        <div class="dash-main">
          <!-- 4 KPIs -->
          <div class="kpi-grid">
            <div class="kpi-card" id="kpi1">
              <div class="kpi-header">
                <span class="kpi-title">Active Members</span>
                <div class="kpi-icon-pill" style="background: rgba(13, 99, 244, 0.2); color: #60A5FA;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
              </div>
              <div class="kpi-val" id="kpiVal1">24,850</div>
              <div class="kpi-footer">
                <span class="kpi-trend-pos">↗ +18.4%</span>
                <span class="kpi-subtext">vs last month</span>
              </div>
            </div>

            <div class="kpi-card" id="kpi2">
              <div class="kpi-header">
                <span class="kpi-title">Community Health</span>
                <div class="kpi-icon-pill" style="background: rgba(253, 85, 49, 0.2); color: #fd5531;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
              <div class="kpi-val" id="kpiVal2">98.4<span style="font-size: 20px; color: #94A3B8;">/100</span></div>
              <div class="kpi-footer">
                <span class="kpi-trend-pos">★ Top 1%</span>
                <span class="kpi-subtext">Tier benchmark</span>
              </div>
            </div>

            <div class="kpi-card" id="kpi3">
              <div class="kpi-header">
                <span class="kpi-title">Member Retention</span>
                <div class="kpi-icon-pill" style="background: rgba(16, 185, 129, 0.2); color: #34D399;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </div>
              </div>
              <div class="kpi-val" id="kpiVal3">88.6%</div>
              <div class="kpi-footer">
                <span class="kpi-trend-pos">↗ +9.2%</span>
                <span class="kpi-subtext">30-day cohort</span>
              </div>
            </div>

            <div class="kpi-card" id="kpi4">
              <div class="kpi-header">
                <span class="kpi-title">Engagement Velocity</span>
                <div class="kpi-icon-pill" style="background: rgba(245, 158, 11, 0.2); color: #FBBF24;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
              </div>
              <div class="kpi-val" id="kpiVal4">94.2%</div>
              <div class="kpi-footer">
                <span class="kpi-trend-pos">⚡ DAU/MAU</span>
                <span class="kpi-subtext">Hyper-engaged</span>
              </div>
            </div>
          </div>

          <!-- Growth Area Chart Panel -->
          <div class="chart-panel">
            <div class="chart-panel-header">
              <div class="chart-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                Active Community Growth & Pulse
              </div>
              <div class="chart-period-picker">
                <div class="chart-period-btn">7D</div>
                <div class="chart-period-btn active">30D</div>
                <div class="chart-period-btn">90D</div>
                <div class="chart-period-btn">1Y</div>
              </div>
            </div>
            <div class="chart-canvas-wrap">
              <div class="chart-tooltip-badge" id="chartTooltip">
                <span>🔥 Peak: +3,410 New Members</span>
              </div>
              <svg viewBox="0 0 1340 420" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0d63f4" stop-opacity="0.45"/>
                    <stop offset="50%" stop-color="#fd5531" stop-opacity="0.15"/>
                    <stop offset="100%" stop-color="#fd5531" stop-opacity="0.0"/>
                  </linearGradient>
                  <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#0d63f4"/>
                    <stop offset="70%" stop-color="#fd5531"/>
                    <stop offset="100%" stop-color="#FBBF24"/>
                  </linearGradient>
                </defs>
                <!-- Grid Lines -->
                <line x1="0" y1="80" x2="1340" y2="80" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                <line x1="0" y1="180" x2="1340" y2="180" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                <line x1="0" y1="280" x2="1340" y2="280" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                <line x1="0" y1="380" x2="1340" y2="380" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

                <!-- Area Fill -->
                <path id="chartArea" d="M 0 380 Q 200 320 400 290 T 800 170 T 1150 90 T 1340 50 L 1340 380 Z" fill="url(#chartGrad)"/>
                
                <!-- Animated Stroke Curve -->
                <path id="chartStroke" d="M 0 380 Q 200 320 400 290 T 800 170 T 1150 90 T 1340 50" fill="none" stroke="url(#strokeGrad)" stroke-width="4.5" stroke-linecap="round"/>
                
                <!-- Glowing Node Point -->
                <circle id="chartNode" cx="1340" cy="50" r="7" fill="#FBBF24" stroke="#FFF" stroke-width="3" style="filter: drop-shadow(0 0 10px #FBBF24);"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 3: THE MODULAR ECOSYSTEM (7.5 - 12s) -->
  <div class="scene" id="scene3">
    <div class="dash-frame" id="dashFrame3">
      <div class="dash-topbar">
        <div class="dash-topbar-left">
          <div class="dash-topbar-logo">${thricoLogoSvg}</div>
          <div class="entity-badge">Unified Platform Modules</div>
        </div>
        <div class="dash-topbar-right">
          <div class="topbar-status">
            <div class="status-pulsing-dot"></div>
            All 6 Modules Active
          </div>
        </div>
      </div>
      <div class="dash-main" style="padding: 30px 36px;">
        <div class="modules-grid">
          <!-- Card 1: Forums -->
          <div class="module-card" id="modCard1">
            <div class="module-top">
              <div>
                <div class="module-icon-wrap" style="background: linear-gradient(135deg, #0d63f4, #0866ff);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                </div>
                <div class="module-title">Discussion Forums</div>
                <div class="module-desc">Dynamic Q&A channels, threaded discussions, upvoting, and verified knowledge bases.</div>
                <div class="module-tag-row">
                  <span class="mini-chip">#ai-founders</span>
                  <span class="mini-chip">#q-and-a</span>
                  <span class="mini-chip">#showcase</span>
                </div>
              </div>
            </div>
            <div class="module-stat-row">
              <span class="module-stat-val">2,410 Active Threads</span>
              <span class="module-stat-tag" style="background: rgba(13,99,244,0.15); color: #60A5FA;">98% Resolved</span>
            </div>
          </div>

          <!-- Card 2: Job Board -->
          <div class="module-card" id="modCard2">
            <div class="module-top">
              <div>
                <div class="module-icon-wrap" style="background: linear-gradient(135deg, #10B981, #059669);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <div class="module-title">Job Board & Hiring</div>
                <div class="module-desc">Vetted job opportunities, seamless 1-click applications, and direct internal hiring.</div>
                <div class="module-tag-row">
                  <span class="mini-chip">Staff AI Engineer</span>
                  <span class="mini-chip">Product Lead</span>
                </div>
              </div>
            </div>
            <div class="module-stat-row">
              <span class="module-stat-val">142 Live Roles</span>
              <span class="module-stat-tag" style="background: rgba(16,185,129,0.15); color: #34D399;">1,890 Applicants</span>
            </div>
          </div>

          <!-- Card 3: Mentorship -->
          <div class="module-card" id="modCard3">
            <div class="module-top">
              <div>
                <div class="module-icon-wrap" style="background: linear-gradient(135deg, #8B5CF6, #6D28D9);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
                </div>
                <div class="module-title">1-on-1 Mentorship Engine</div>
                <div class="module-desc">Smart mentor-mentee pairing, automated scheduling, goal tracking, and session reviews.</div>
                <div class="module-tag-row">
                  <span class="mini-chip" style="background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.3); color: #C4B5FD;">Smart Matching (98% match)</span>
                </div>
              </div>
            </div>
            <div class="module-stat-row">
              <span class="module-stat-val">89 Active Pairings</span>
              <span class="module-stat-tag" style="background: rgba(139,92,246,0.15); color: #A78BFA;">★ 4.9 Rating</span>
            </div>
          </div>

          <!-- Card 4: Gamification & Wallet -->
          <div class="module-card" id="modCard4">
            <div class="module-top">
              <div>
                <div class="module-icon-wrap" style="background: linear-gradient(135deg, #F59E0B, #D97706);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <div class="module-title">Karma Coins & Gamification</div>
                <div class="module-desc">Reward community contributions, level progression, custom badges, and reward redemptions.</div>
                <div class="module-tag-row">
                  <span class="mini-chip">🏆 Top Contributor</span>
                  <span class="mini-chip">💎 Diamond Tier</span>
                </div>
              </div>
            </div>
            <div class="module-stat-row">
              <span class="module-stat-val">1,200,000 Coins Minted</span>
              <span class="module-stat-tag" style="background: rgba(245,158,11,0.15); color: #FBBF24;">Tier 3 Unlocked</span>
            </div>
          </div>

          <!-- Card 5: Trust & Safety -->
          <div class="module-card" id="modCard5">
            <div class="module-top">
              <div>
                <div class="module-icon-wrap" style="background: linear-gradient(135deg, #EF4444, #DC2626);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </div>
                <div class="module-title">Safety & Trust Radar</div>
                <div class="module-desc">AI-powered toxicity screening, automated spam shielding, and one-click moderation queues.</div>
                <div class="module-tag-row">
                  <span class="mini-chip">Verified Members</span>
                  <span class="mini-chip">Automated Shield</span>
                </div>
              </div>
            </div>
            <div class="module-stat-row">
              <span class="module-stat-val">0 Pending Flags</span>
              <span class="module-stat-tag" style="background: rgba(239,68,68,0.15); color: #F87171;">100% SLA</span>
            </div>
          </div>

          <!-- Card 6: Website Builder -->
          <div class="module-card" id="modCard6">
            <div class="module-top">
              <div>
                <div class="module-icon-wrap" style="background: linear-gradient(135deg, #EC4899, #DB2777);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <div class="module-title">Branded Public Portal</div>
                <div class="module-desc">Launch custom branded public landing pages, membership tiers, and event showcases.</div>
                <div class="module-tag-row">
                  <span class="mini-chip">community.thrico.com</span>
                </div>
              </div>
            </div>
            <div class="module-stat-row">
              <span class="module-stat-val">12 Custom Pages</span>
              <span class="module-stat-tag" style="background: rgba(236,72,153,0.15); color: #F472B6;">Live & Hosted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 4: MEMBER IMPACT & LEADERBOARDS (12 - 16.5s) -->
  <div class="scene" id="scene4">
    <div class="dash-frame" id="dashFrame4" style="position: relative;">
      <!-- Floating Unlock Toast -->
      <div class="celebration-toast" id="toastPop">
        <div class="toast-icon">🏆</div>
        <div>
          <div class="toast-text-title">Level Up: Tier 3 Master Mentor</div>
          <div class="toast-text-desc">Sarah Chen just achieved 12,450 Karma Coins & 48 Mentees!</div>
        </div>
      </div>

      <div class="dash-topbar">
        <div class="dash-topbar-left">
          <div class="dash-topbar-logo">${thricoLogoSvg}</div>
          <div class="entity-badge">Community Impact & Recognition</div>
        </div>
        <div class="dash-topbar-right">
          <div class="topbar-status">
            <div class="status-pulsing-dot"></div>
            Live Activity Feed
          </div>
        </div>
      </div>
      <div class="dash-main" style="padding: 28px 36px;">
        <div class="impact-container">
          <!-- Left: Leaderboard -->
          <div class="leaderboard-panel" style="justify-content: flex-start; gap: 18px;">
            <div class="leaderboard-header">
              <div style="font-size: 19px; font-weight: 700; color: #FFF; display: flex; align-items: center; gap: 10px;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                Top Community Leaders & Contributors
              </div>
              <span style="font-size: 13px; color: #94A3B8; font-weight: 700;">Live Ticker</span>
            </div>

            <div class="leaderboard-list">
              <div class="leader-item top-rank" id="leader1">
                <div class="leader-left">
                  <div class="leader-rank rank-1">1</div>
                  <div class="leader-avatar">SC</div>
                  <div>
                    <div class="leader-name">Sarah Chen</div>
                    <div class="leader-role">Principal AI Engineer · 48 Mentees</div>
                  </div>
                </div>
                <div class="leader-karma">🪙 12,450 pts</div>
              </div>

              <div class="leader-item" id="leader2">
                <div class="leader-left">
                  <div class="leader-rank rank-2">2</div>
                  <div class="leader-avatar" style="background: linear-gradient(135deg, #0d63f4, #10B981);">AR</div>
                  <div>
                    <div class="leader-name">Alex Rivera</div>
                    <div class="leader-role">Founder · 124 Discussions</div>
                  </div>
                </div>
                <div class="leader-karma" style="color: #E2E8F0;">🪙 9,820 pts</div>
              </div>

              <div class="leader-item" id="leader3">
                <div class="leader-left">
                  <div class="leader-rank rank-3">3</div>
                  <div class="leader-avatar" style="background: linear-gradient(135deg, #8B5CF6, #fd5531);">MP</div>
                  <div>
                    <div class="leader-name">Maya Patel</div>
                    <div class="leader-role">Product Lead · 32 Events</div>
                  </div>
                </div>
                <div class="leader-karma" style="color: #E2E8F0;">🪙 8,150 pts</div>
              </div>

              <div class="leader-item" id="leader4">
                <div class="leader-left">
                  <div class="leader-rank" style="background: rgba(255,255,255,0.1); color: #FFF;">4</div>
                  <div class="leader-avatar" style="background: linear-gradient(135deg, #06B6D4, #3B82F6);">DK</div>
                  <div>
                    <div class="leader-name">David Kim</div>
                    <div class="leader-role">Community Organizer · 28 Mentees</div>
                  </div>
                </div>
                <div class="leader-karma" style="color: #E2E8F0;">🪙 6,420 pts</div>
              </div>

              <div class="leader-item" id="leader5">
                <div class="leader-left">
                  <div class="leader-rank" style="background: rgba(255,255,255,0.1); color: #FFF;">5</div>
                  <div class="leader-avatar" style="background: linear-gradient(135deg, #EC4899, #8B5CF6);">ER</div>
                  <div>
                    <div class="leader-name">Elena Rostova</div>
                    <div class="leader-role">Staff Researcher · 18 Discussions</div>
                  </div>
                </div>
                <div class="leader-karma" style="color: #E2E8F0;">🪙 5,910 pts</div>
              </div>
            </div>
          </div>

          <!-- Right: Conversion Funnel & Live Feed -->
          <div class="leaderboard-panel" style="justify-content: flex-start; gap: 20px;">
            <div>
              <div style="font-size: 19px; font-weight: 700; color: #FFF; margin-bottom: 6px;">Member Journey Velocity</div>
              <div style="font-size: 13px; color: #94A3B8;">Onboarding to active high-impact contributor conversion</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 4px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 6px;">
                  <span>1. Onboarded Members</span>
                  <span style="color: #60A5FA;">100% (24,850)</span>
                </div>
                <div style="height: 10px; background: rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden;">
                  <div style="width: 100%; height: 100%; background: #0d63f4; border-radius: 6px;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 6px;">
                  <span>2. First Forum / Q&A Contribution</span>
                  <span style="color: #34D399;">84.2% (20,920)</span>
                </div>
                <div style="height: 10px; background: rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden;">
                  <div style="width: 84.2%; height: 100%; background: #10B981; border-radius: 6px;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 6px;">
                  <span>3. Active Mentorship or Job Application</span>
                  <span style="color: #FBBF24;">68.5% (17,020)</span>
                </div>
                <div style="height: 10px; background: rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden;">
                  <div style="width: 68.5%; height: 100%; background: #F59E0B; border-radius: 6px;"></div>
                </div>
              </div>
            </div>

            <!-- Live Feed List -->
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
              <div class="live-feed-row">
                <div class="live-feed-dot"></div>
                <span>✨ <strong>Maya Patel</strong> matched with Mentor David K. (2m ago)</span>
              </div>
              <div class="live-feed-row">
                <div class="live-feed-dot"></div>
                <span>💼 <strong>Alex R.</strong> referred Jordan Lee for Senior AI Eng (6m ago)</span>
              </div>
              <div class="live-feed-row">
                <div class="live-feed-dot"></div>
                <span>🪙 <strong>Sarah Chen</strong> awarded 250 Karma for accepted solution (12m ago)</span>
              </div>
            </div>

            <div style="padding: 12px 16px; border-radius: 10px; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); font-size: 13px; font-weight: 700; color: #34D399; display: flex; align-items: center; gap: 8px;">
              <span>📈 2.8x higher engagement than traditional platforms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 5: PUNCHLINE & OUTRO (16.5 - 20s) -->
  <div class="scene" id="scene5">
    <div class="outro-badge">
      ⚡ Launching The Future of Communities
    </div>
    <div class="outro-logo-wrap" id="outroLogo">
      ${thricoLogoSvg}
    </div>
    <div class="outro-h1" id="outroH1">
      ONE PLATFORM.
      <br>
      EVERY CONNECTION THAT MATTERS.
    </div>
    <div class="outro-sub" id="outroSub">
      The complete ecosystem OS for universities, organizations, and modern communities.
    </div>
    <div class="outro-cta-btn" id="outroCta">
      Launch Your Community Ecosystem
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </div>
    <div class="outro-url">THRICO.COM</div>
  </div>

  <!-- Universal Settled Caption Bar -->
  <div class="caption-bar" id="captionBar">
    <div class="caption-indicator"></div>
    <span id="captionText">The All-in-One Community Operating System</span>
  </div>

  <!-- Simulated Cursor -->
  <svg class="mouse-cursor" id="mouseCursor" viewBox="0 0 24 24" fill="none">
    <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" fill="#FFF" stroke="#000" stroke-width="1.5"/>
  </svg>

</div>

<script>
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

  const scene1 = document.getElementById('scene1');
  const scene2 = document.getElementById('scene2');
  const scene3 = document.getElementById('scene3');
  const scene4 = document.getElementById('scene4');
  const scene5 = document.getElementById('scene5');

  const captionBar = document.getElementById('captionBar');
  const captionText = document.getElementById('captionText');
  const mouseCursor = document.getElementById('mouseCursor');

  const hookIcon = document.getElementById('hookIcon');
  const hookStrike = document.getElementById('hookStrike');
  const dashFrame2 = document.getElementById('dashFrame2');
  const chartStroke = document.getElementById('chartStroke');
  const chartArea = document.getElementById('chartArea');
  const chartNode = document.getElementById('chartNode');
  const chartTooltip = document.getElementById('chartTooltip');

  const kpiVal1 = document.getElementById('kpiVal1');
  const kpiVal2 = document.getElementById('kpiVal2');
  const kpiVal3 = document.getElementById('kpiVal3');
  const kpiVal4 = document.getElementById('kpiVal4');

  const modCard3 = document.getElementById('modCard3');
  const toastPop = document.getElementById('toastPop');

  const glow1 = document.getElementById('glow1');
  const glow2 = document.getElementById('glow2');

  const pathTotalLength = 1500;
  chartStroke.style.strokeDasharray = pathTotalLength;

  window.setFrame = function(timeMs) {
    const t = timeMs / 1000.0;

    // Ambient floating lights
    glow1.style.transform = \`translate(\${Math.sin(t * 0.8) * 60}px, \${Math.cos(t * 0.6) * 50}px)\`;
    glow2.style.transform = \`translate(\${Math.cos(t * 0.7) * 70}px, \${Math.sin(t * 0.9) * 60}px)\`;

    scene1.style.opacity = 0;
    scene2.style.opacity = 0;
    scene3.style.opacity = 0;
    scene4.style.opacity = 0;
    scene5.style.opacity = 0;
    mouseCursor.style.opacity = 0;

    // --- SCENE 1: 0.0s to 3.0s ---
    if (t < 3.0) {
      scene1.style.opacity = 1;

      let scale = 0.85 + easeOutCubic(clamp(t / 1.5, 0, 1)) * 0.25;
      let spin = Math.sin(t * 1.5) * 4;
      hookIcon.style.transform = \`scale(\${scale}) rotate(\${spin}deg)\`;

      if (t >= 2.6) {
        let exitT = (t - 2.6) / 0.4;
        scene1.style.opacity = 1 - exitT;
        scene1.style.transform = \`scale(\${1 + exitT * 0.15})\`;
      } else {
        scene1.style.transform = 'scale(1)';
      }

      captionBar.style.opacity = 1;
      captionText.textContent = "Stop stitching 10 disconnected tools together.";
    }

    // --- SCENE 2: 3.0s to 7.5s ---
    else if (t >= 3.0 && t < 7.5) {
      scene2.style.opacity = 1;
      let s2T = t - 3.0;

      let entrance = easeOutCubic(clamp(s2T / 1.0, 0, 1));
      dashFrame2.style.transform = \`scale(\${0.92 + entrance * 0.08}) translateY(\${(1 - entrance) * 40}px)\`;

      let countProgress = easeOutCubic(clamp((s2T - 0.3) / 1.8, 0, 1));
      let val1 = Math.round(18000 + countProgress * 6850);
      kpiVal1.textContent = val1.toLocaleString();

      let val2 = (80.0 + countProgress * 18.4).toFixed(1);
      kpiVal2.innerHTML = val2 + '<span style="font-size: 20px; color: #94A3B8;">/100</span>';

      let val3 = (72.0 + countProgress * 16.6).toFixed(1);
      kpiVal3.textContent = val3 + '%';

      let val4 = (78.0 + countProgress * 16.2).toFixed(1);
      kpiVal4.textContent = val4 + '%';

      let chartProg = easeInOutCubic(clamp((s2T - 0.5) / 2.2, 0, 1));
      chartStroke.style.strokeDashoffset = pathTotalLength * (1 - chartProg);
      chartArea.style.opacity = chartProg;
      chartNode.style.opacity = chartProg;

      if (s2T > 2.2) {
        chartTooltip.style.opacity = clamp((s2T - 2.2) / 0.4, 0, 1);
      } else {
        chartTooltip.style.opacity = 0;
      }

      if (s2T >= 4.0) {
        let exitT = (s2T - 4.0) / 0.5;
        scene2.style.opacity = 1 - exitT;
        scene2.style.transform = \`scale(\${1 - exitT * 0.05})\`;
      } else {
        scene2.style.transform = 'scale(1)';
      }

      captionBar.style.opacity = 1;
      captionText.textContent = "Real-time vitals. Zero guesswork.";
    }

    // --- SCENE 3: 7.5s to 12.0s ---
    else if (t >= 7.5 && t < 12.0) {
      scene3.style.opacity = 1;
      let s3T = t - 7.5;

      let entrance = easeOutCubic(clamp(s3T / 0.8, 0, 1));
      document.getElementById('dashFrame3').style.transform = \`scale(\${0.95 + entrance * 0.05})\`;

      for (let i = 1; i <= 6; i++) {
        let card = document.getElementById('modCard' + i);
        let cardT = clamp((s3T - i * 0.1) / 0.5, 0, 1);
        let cardEase = easeOutCubic(cardT);
        card.style.opacity = cardEase;
        card.style.transform = \`translateY(\${(1 - cardEase) * 25}px)\`;
      }

      if (s3T > 1.4 && s3T < 3.8) {
        mouseCursor.style.opacity = 1;
        let cT = clamp((s3T - 1.4) / 1.0, 0, 1);
        let cEase = easeInOutCubic(cT);
        let cursorX = 820 + cEase * 380;
        let cursorY = 660 - cEase * 220;
        mouseCursor.style.transform = \`translate(\${cursorX}px, \${cursorY}px)\`;

        if (s3T > 2.4) {
          modCard3.classList.add('highlight');
          modCard3.style.transform = 'scale(1.03) translateY(-4px)';
        } else {
          modCard3.classList.remove('highlight');
        }
      } else {
        modCard3.classList.remove('highlight');
      }

      if (s3T >= 4.0) {
        let exitT = (s3T - 4.0) / 0.5;
        scene3.style.opacity = 1 - exitT;
      }

      captionBar.style.opacity = 1;
      captionText.textContent = "Forums. Jobs. Mentorship. Rewards. All connected.";
    }

    // --- SCENE 4: 12.0s to 16.5s ---
    else if (t >= 12.0 && t < 16.5) {
      scene4.style.opacity = 1;
      let s4T = t - 12.0;

      let entrance = easeOutCubic(clamp(s4T / 0.8, 0, 1));
      document.getElementById('dashFrame4').style.transform = \`scale(\${0.95 + entrance * 0.05})\`;

      if (s4T >= 1.2) {
        let toastT = clamp((s4T - 1.2) / 0.5, 0, 1);
        let toastEase = easeOutBack(toastT);
        toastPop.style.opacity = toastT;
        toastPop.style.transform = \`scale(\${toastEase}) translateY(\${(1 - toastT) * -20}px)\`;
      } else {
        toastPop.style.opacity = 0;
      }

      if (s4T >= 4.0) {
        let exitT = (s4T - 4.0) / 0.5;
        scene4.style.opacity = 1 - exitT;
        scene4.style.transform = \`scale(\${1 - exitT * 0.08})\`;
      } else {
        scene4.style.transform = 'scale(1)';
      }

      captionBar.style.opacity = 1;
      captionText.textContent = "Turn passive members into active leaders.";
    }

    // --- SCENE 5: 16.5s to 20.0s ---
    else {
      scene5.style.opacity = 1;
      let s5T = t - 16.5;

      let s5Ease = easeOutCubic(clamp(s5T / 1.0, 0, 1));
      scene5.style.transform = \`scale(\${0.92 + s5Ease * 0.08})\`;

      captionBar.style.opacity = 0;
    }
  };
</script>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'template.html'), htmlContent);
console.log('Successfully updated template.html!');
