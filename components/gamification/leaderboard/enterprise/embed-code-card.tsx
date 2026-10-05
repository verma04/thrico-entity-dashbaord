"use client";

import React, { useState } from "react";
import {
  EnterpriseLeaderboardConfig,
  EnterpriseClient,
} from "@/graphql/actions/enterprise-leaderboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Code2,
  Copy,
  Check,
  Globe,
  Terminal,
  Flame,
  Award,
  Crown,
  TrendingUp,
  Sparkles,
  Layout,
  FileCode2,
  Download,
} from "lucide-react";

interface EmbedCodeCardProps {
  client: EnterpriseClient | null;
  leaderboards: EnterpriseLeaderboardConfig[];
  selectedCode?: string;
}

export function EmbedCodeCard({
  client,
  leaderboards,
  selectedCode,
}: EmbedCodeCardProps) {
  const [activeCode, setActiveCode] = useState<string>(
    selectedCode || leaderboards[0]?.code || "enterprise_monthly_champions"
  );
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const currentLeaderboard =
    leaderboards.find((lb) => lb.code === activeCode) || leaderboards[0];

  const clientId = client?.clientId || "YOUR_CLIENT_ID";
  const lbCode = currentLeaderboard?.code || activeCode;

  // 1. Complete Standalone Drop-in HTML Widget
  const htmlSnippet = `<!-- ======================================================== -->
<!-- THRICO HEADLESS LEADERBOARD — DROP-IN HTML WIDGET         -->
<!-- Place this HTML wherever you want the leaderboard to appear-->
<!-- ======================================================== -->

<div id="thrico-leaderboard" class="t-lb-widget">
  <!-- Top 3 Podium -->
  <div id="t-lb-podium" class="t-lb-podium">
    <div class="t-lb-loading">Loading champions...</div>
  </div>

  <!-- Standings Table -->
  <div class="t-lb-card">
    <table class="t-lb-table">
      <thead>
        <tr>
          <th style="width: 70px;">Rank</th>
          <th>Participant</th>
          <th>Movement</th>
          <th style="text-align: right;">Points</th>
        </tr>
      </thead>
      <tbody id="t-lb-entries">
        <tr>
          <td colspan="4" class="t-lb-loading">Loading standings...</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls Bar -->
    <div class="t-lb-pagination">
      <div class="t-lb-page-summary">
        <span id="t-lb-entries-count">Showing 0 of 0</span>
        <select id="t-lb-page-size" class="t-lb-select">
          <option value="10">10 / page</option>
          <option value="20" selected>20 / page</option>
          <option value="50">50 / page</option>
          <option value="100">100 / page</option>
        </select>
      </div>
      <div class="t-lb-page-nav">
        <button id="t-lb-first" class="t-lb-page-btn" title="First Page" disabled>« First</button>
        <button id="t-lb-prev" class="t-lb-page-btn" disabled>‹ Prev</button>
        <span id="t-lb-page-info" class="t-lb-page-info">Page 1 of 1</span>
        <button id="t-lb-next" class="t-lb-page-btn" disabled>Next ›</button>
        <button id="t-lb-last" class="t-lb-page-btn" title="Last Page" disabled>Last »</button>
      </div>
    </div>
  </div>

  <!-- Sticky / Bottom Current User Rank Bar (Optional) -->
  <div id="t-lb-my-rank" class="t-lb-my-rank" style="display: none;">
    <div class="t-lb-my-info">
      <span class="t-lb-my-badge">Your Rank</span>
      <span id="t-lb-my-position" class="t-lb-my-pos">#--</span>
    </div>
    <div id="t-lb-my-score" class="t-lb-my-pts">-- pts</div>
  </div>
</div>

<!-- ======================================================== -->
<!-- WIDGET STYLES (Scoped CSS)                                -->
<!-- ======================================================== -->
<style>
  .t-lb-widget {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    max-width: 860px;
    margin: 0 auto;
    color: #1e293b;
    box-sizing: border-box;
  }
  .t-lb-widget * { box-sizing: border-box; }
  .t-lb-podium {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 14px;
    margin-bottom: 24px;
    padding: 16px 0;
  }
  .t-lb-podium-col {
    flex: 1;
    max-width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 18px 12px;
    border-radius: 14px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }
  .t-lb-podium-col.gold {
    border-color: #f59e0b;
    background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.16);
  }
  .t-lb-medal {
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 99px;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  .t-lb-medal.gold { background: #fef3c7; color: #b45309; }
  .t-lb-medal.silver { background: #f1f5f9; color: #475569; }
  .t-lb-medal.bronze { background: #ffedd5; color: #c2410c; }
  .t-lb-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 8px;
    border: 2px solid #e2e8f0;
    background: #e2e8f0;
  }
  .gold .t-lb-avatar { width: 56px; height: 56px; border-color: #f59e0b; }
  .t-lb-name {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .t-lb-badge {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
  }
  .t-lb-points {
    font-size: 14px;
    font-weight: 700;
    color: #0284c7;
    margin-top: 6px;
  }
  .t-lb-card {
    background: #ffffff;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }
  .t-lb-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .t-lb-table th {
    text-align: left;
    padding: 12px 16px;
    background: #f8fafc;
    color: #64748b;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e2e8f0;
  }
  .t-lb-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }
  .t-lb-rank {
    font-weight: 700;
    color: #64748b;
  }
  .t-lb-user-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .t-lb-table-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    background: #e2e8f0;
  }
  .t-lb-delta-up { color: #16a34a; font-weight: 600; font-size: 11px; }
  .t-lb-delta-down { color: #dc2626; font-weight: 600; font-size: 11px; }
  .t-lb-delta-same { color: #94a3b8; font-size: 11px; }
  .t-lb-pts-cell { font-weight: 700; color: #0f172a; text-align: right; }
  .t-lb-loading { text-align: center; padding: 28px; color: #94a3b8; font-size: 13px; }
  .t-lb-my-rank {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding: 14px 18px;
    border-radius: 12px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
  }
  .t-lb-my-badge { font-size: 11px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; }
  .t-lb-my-pos { font-size: 15px; font-weight: 800; color: #1e3a8a; margin-left: 8px; }
  .t-lb-my-pts { font-size: 14px; font-weight: 700; color: #1d4ed8; font-mono: monospace; }
  .t-lb-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid #f1f5f9;
    background: #f8fafc;
    flex-wrap: wrap;
    gap: 12px;
  }
  .t-lb-page-summary {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #64748b;
    font-size: 12px;
  }
  .t-lb-select {
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    font-size: 12px;
    color: #334155;
    cursor: pointer;
    outline: none;
  }
  .t-lb-page-nav {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .t-lb-page-btn {
    padding: 5px 11px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    color: #1e293b;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .t-lb-page-btn:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #94a3b8;
  }
  .t-lb-page-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .t-lb-page-info {
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    padding: 0 6px;
  }
</style>

<!-- ======================================================== -->
<!-- THRICO LEADERBOARD SDK & DATA RENDERING SCRIPT             -->
<!-- ======================================================== -->
<script src="https://sdk.thrico.network/leaderboard/v1/leaderboard.min.js"></script>
<script>
  (function() {
    // 1. Initialize Leaderboard Client
    const leaderboard = ThricoLeaderboard.init({
      clientId: "${clientId}"
    });

    const CODE = "${lbCode}";

    // 2. Fetch and Render Top 3 Champions Podium
    leaderboard.getTopUsers(CODE, { limit: 3 }).then(res => {
      const top = res.top || [];
      const podiumEl = document.getElementById("t-lb-podium");
      if (!top.length) {
        podiumEl.innerHTML = '<div class="t-lb-loading">No standings recorded yet</div>';
        return;
      }
      const p1 = top[0];
      const p2 = top[1];
      const p3 = top[2];

      const renderPodiumCol = (p, rankClass, medalLabel) => {
        if (!p) return '';
        const name = p.user?.displayName || 'Member';
        const avatar = p.user?.avatarUrl || 'https://assets.thrico.network/avatar-placeholder.png';
        const badgeHtml = p.user?.badges?.[0]?.name
          ? '<div class="t-lb-badge">🎖️ ' + p.user.badges[0].name + '</div>'
          : '';
        return '<div class="t-lb-podium-col ' + rankClass + '">' +
                 '<span class="t-lb-medal ' + rankClass + '">' + medalLabel + '</span>' +
                 '<img class="t-lb-avatar" src="' + avatar + '" alt="' + name + '" onerror="this.src=\\'https://assets.thrico.network/avatar-placeholder.png\\'" />' +
                 '<div class="t-lb-name">' + name + '</div>' +
                 badgeHtml +
                 '<div class="t-lb-points">' + Number(p.points).toLocaleString() + ' pts</div>' +
               '</div>';
      };

      podiumEl.innerHTML = (p2 ? renderPodiumCol(p2, 'silver', '#2 Silver') : '') +
                           (p1 ? renderPodiumCol(p1, 'gold', '👑 #1 Champion') : '') +
                           (p3 ? renderPodiumCol(p3, 'bronze', '#3 Bronze') : '');
    }).catch(err => {
      console.error("Podium load error:", err);
      const el = document.getElementById("t-lb-podium");
      if (el) el.style.display = 'none';
    });

    // 3. Paginated Standings with Full Interactive Controls
    var currentPage = 1;
    var pageSize = 20;
    var totalPages = 1;

    function renderPaginationUI(pagination, currentCount) {
      pagination = pagination || {};
      
      var total = null;
      if (typeof pagination.total === 'number') total = pagination.total;
      else if (typeof pagination.totalEntries === 'number') total = pagination.totalEntries;
      else if (typeof pagination.count === 'number') total = pagination.count;

      if (typeof pagination.totalPages === 'number' && pagination.totalPages > 0) {
        totalPages = pagination.totalPages;
      } else if (total !== null) {
        totalPages = Math.max(1, Math.ceil(total / pageSize));
      } else {
        if (currentCount >= pageSize) {
          totalPages = Math.max(totalPages, currentPage + 1);
        } else {
          totalPages = Math.max(1, currentPage);
        }
      }

      var hasPrev = typeof pagination.hasPrev === 'boolean'
        ? pagination.hasPrev
        : typeof pagination.hasPreviousPage === 'boolean'
          ? pagination.hasPreviousPage
          : currentPage > 1;

      var hasNext = typeof pagination.hasNext === 'boolean'
        ? pagination.hasNext
        : typeof pagination.hasNextPage === 'boolean'
          ? pagination.hasNextPage
          : (total !== null ? currentPage < totalPages : currentCount >= pageSize);

      var start = (currentCount === 0) ? 0 : (currentPage - 1) * pageSize + 1;
      var end = (total !== null)
        ? Math.min(currentPage * pageSize, total)
        : (currentCount === 0 ? 0 : (currentPage - 1) * pageSize + currentCount);

      var countEl = document.getElementById("t-lb-entries-count");
      if (countEl) {
        if (total !== null) {
          countEl.innerText = 'Showing ' + start + '–' + end + ' of ' + total.toLocaleString();
        } else {
          countEl.innerText = 'Showing ' + start + '–' + end + (hasNext ? '+' : '');
        }
      }

      var pageInfo = document.getElementById("t-lb-page-info");
      if (pageInfo) pageInfo.innerText = 'Page ' + currentPage + (totalPages > 1 ? (' of ' + totalPages) : '');

      var firstBtn = document.getElementById("t-lb-first");
      var prevBtn = document.getElementById("t-lb-prev");
      var nextBtn = document.getElementById("t-lb-next");
      var lastBtn = document.getElementById("t-lb-last");

      if (firstBtn) firstBtn.disabled = !hasPrev || currentPage <= 1;
      if (prevBtn) prevBtn.disabled = !hasPrev || currentPage <= 1;
      if (nextBtn) nextBtn.disabled = !hasNext || (total !== null && currentPage >= totalPages);
      if (lastBtn) lastBtn.disabled = !hasNext || currentPage >= totalPages || total === null;
    }

    // Helper to query entries with full root pagination metadata preservation
    async function fetchEntriesWithPagination(page, limit) {
      try {
        if (leaderboard && leaderboard.tokenManager && typeof leaderboard.tokenManager.getValidToken === 'function') {
          var token = await leaderboard.tokenManager.getValidToken();
          var baseUrl = leaderboard.endpoint || 'https://thrico-tracking.thrico.app';
          var apiUrl = baseUrl + '/v1/sdk/leaderboards/' + encodeURIComponent(CODE) + '/entries?page=' + page + '&limit=' + limit;
          var resp = await fetch(apiUrl, {
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token,
              'X-Thrico-Client-Id': leaderboard.clientId
            }
          });
          if (resp.ok) {
            var json = await resp.json();
            return {
              entries: json.data?.entries || [],
              pagination: json.pagination || json.data?.pagination || null
            };
          }
        }
      } catch (e) {
        console.warn('Direct pagination fetch fallback:', e);
      }

      var sdkRes = await leaderboard.getEntries(CODE, { page: page, limit: limit });
      return {
        entries: sdkRes.entries || [],
        pagination: sdkRes.pagination || null
      };
    }

    function loadEntries(page, limit) {
      currentPage = Math.max(1, page);
      pageSize = limit;
      var tbody = document.getElementById("t-lb-entries");
      if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="t-lb-loading">Loading standings...</td></tr>';

      fetchEntriesWithPagination(currentPage, pageSize).then(function(res) {
        var entries = res.entries || [];
        if (!entries.length) {
          tbody.innerHTML = '<tr><td colspan="4" class="t-lb-loading">No entries found</td></tr>';
          renderPaginationUI({ total: 0, hasPrev: false, hasNext: false }, 0);
          return;
        }

        tbody.innerHTML = entries.map(function(entry) {
          var name = entry.user?.displayName || 'Member';
          var avatar = entry.user?.avatarUrl || 'https://assets.thrico.network/avatar-placeholder.png';
          var badgeHtml = entry.user?.badges && entry.user.badges.length > 0
            ? '<span style="color:#64748b; font-size:11px; margin-left:6px;">• ' + entry.user.badges[0].name + '</span>'
            : '';

          var deltaHtml = '<span class="t-lb-delta-same">— 0</span>';
          if (entry.movement > 0) deltaHtml = '<span class="t-lb-delta-up">▲ +' + entry.movement + '</span>';
          else if (entry.movement < 0) deltaHtml = '<span class="t-lb-delta-down">▼ ' + entry.movement + '</span>';

          return '<tr>' +
                   '<td class="t-lb-rank">#' + entry.rank + '</td>' +
                   '<td><div class="t-lb-user-cell">' +
                     '<img class="t-lb-table-avatar" src="' + avatar + '" alt="' + name + '" onerror="this.src=\\'https://assets.thrico.network/avatar-placeholder.png\\'" />' +
                     '<div><span style="font-weight:600;">' + name + '</span>' + badgeHtml + '</div>' +
                   '</div></td>' +
                   '<td>' + deltaHtml + '</td>' +
                   '<td class="t-lb-pts-cell">' + Number(entry.points).toLocaleString() + ' pts</td>' +
                 '</tr>';
        }).join('');

        renderPaginationUI(res.pagination, entries.length);
      }).catch(function(err) {
        console.error("Entries load error:", err);
        if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="t-lb-loading">Failed to load standings</td></tr>';
      });
    }

    // Attach Pagination Event Listeners
    var firstBtn = document.getElementById("t-lb-first");
    var prevBtn = document.getElementById("t-lb-prev");
    var nextBtn = document.getElementById("t-lb-next");
    var lastBtn = document.getElementById("t-lb-last");
    var pageSizeSelect = document.getElementById("t-lb-page-size");

    if (firstBtn) firstBtn.addEventListener("click", function() {
      if (currentPage > 1) loadEntries(1, pageSize);
    });
    if (prevBtn) prevBtn.addEventListener("click", function() {
      if (currentPage > 1) loadEntries(currentPage - 1, pageSize);
    });
    if (nextBtn) nextBtn.addEventListener("click", function() {
      loadEntries(currentPage + 1, pageSize);
    });
    if (lastBtn) lastBtn.addEventListener("click", function() {
      if (totalPages > 1 && currentPage < totalPages) {
        loadEntries(totalPages, pageSize);
      }
    });
    if (pageSizeSelect) pageSizeSelect.addEventListener("change", function(e) {
      loadEntries(1, parseInt(e.target.value, 10) || 20);
    });

    // Initial load
    loadEntries(1, pageSize);
  })();
</script>`;

  // 2. Headless CDN Script Code
  const cdnSnippet = `<!-- 1. Include Thrico CDN SDK -->
<script src="https://sdk.thrico.network/leaderboard/v1/leaderboard.min.js"></script>

<!-- 2. Initialize & Query Leaderboard -->
<script>
  const leaderboard = ThricoLeaderboard.init({
    clientId: "${clientId}"
  });

  // Fetch Top 3 Podium
  leaderboard.getTopUsers("${lbCode}", { limit: 3 })
    .then(data => {
      console.log("Top 3 Champions:", data.top);
      // Render your custom Gold, Silver, Bronze podium DOM
    });

  // Fetch Paginated Entries
  leaderboard.getEntries("${lbCode}", { page: 1, limit: 20 })
    .then(data => {
      console.log("Leaderboard Page 1:", data.entries);
      // Render your native HTML/CSS table
    });

  // Fetch Current Logged-in Member Rank
  leaderboard.getCurrentUserRank("${lbCode}", { userId: "CURRENT_USER_ID" })
    .then(data => {
      console.log("My Rank Position:", data);
      // Render sticky bottom widget: e.g. "Your Rank: #127"
    });
</script>`;

  // 4. Standalone Executable Test Script (.sh)
  const shSnippet = `#!/usr/bin/env bash
# ==============================================================================
# Thrico Headless Leaderboard Automated REST API Test Script
# Pre-configured for: ${lbCode}
# ==============================================================================
set -e

API_BASE="https://thrico-tracking.thrico.app/v1/sdk"
CLIENT_ID="${clientId}"
ORIGIN="http://localhost:5173"
LB_CODE="${lbCode}"
TEST_USER_ID="4fe5617f-22f4-42cb-8093-26bf64964cd1"

echo "=================================================="
echo " Testing Thrico Leaderboard SDK REST Endpoints"
echo " Board Code: $LB_CODE"
echo " Endpoint:   $API_BASE"
echo "=================================================="

# 1. Request Short-Lived JWT Token (Bearer)
echo -e "\n[1/6] Requesting Access Token..."
TOKEN=$(curl -s -X POST "$API_BASE/auth/token" \\
  -H "Content-Type: application/json" \\
  -H "Origin: $ORIGIN" \\
  -d "{\\"clientId\\": \\"$CLIENT_ID\\"}" | jq -r '.data.accessToken')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "Failed to get access token!"
  exit 1
fi
echo "✓ Token obtained successfully! (\${TOKEN:0:30}...)"

# 2. Fetch Top 3 Podium
echo -e "\n[2/6] Fetching Top 3 Champions Podium..."
curl -s -X GET "$API_BASE/leaderboards/$LB_CODE/top?limit=3" \\
  -H "Authorization: Bearer $TOKEN" | jq '{ leaderboard: .data.leaderboard, champions: [.data.top[] | { rank: .rank, name: .user.displayName, points: .points }] }'

# 3. Fetch Paginated Entries
echo -e "\n[3/6] Fetching Standings (Page 1)..."
curl -s -X GET "$API_BASE/leaderboards/$LB_CODE/entries?page=1&limit=5" \\
  -H "Authorization: Bearer $TOKEN" | jq '{ total: .pagination.total, page: .pagination.page, entries: [.data.entries[] | { rank: .rank, name: .user.displayName, points: .points }] }'

# 4. Fetch Current User Rank
echo -e "\n[4/6] Fetching Specific User Rank (ID: $TEST_USER_ID)..."
curl -s -X GET "$API_BASE/leaderboards/$LB_CODE/me" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "X-User-Id: $TEST_USER_ID" | jq '{ rank: .data.rank, points: .data.points, name: .data.user.displayName }'

# 5. Update Leaderboard Configuration
echo -e "\n[5/6] Updating Leaderboard Configuration..."
curl -s -X PATCH "$API_BASE/leaderboards/$LB_CODE" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "${currentLeaderboard?.name || "Champions"}", "status": "ACTIVE", "badgeVisibility": true}' | jq '{ message: .message, code: .data.code, name: .data.name, status: .data.status }'

# 6. Update Allowed Domains & Rate Limit Settings
echo -e "\n[6/6] Updating Allowed Domains Whitelist & Rate Limits..."
curl -s -X PATCH "$API_BASE/settings" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"allowedDomains": ["http://localhost:3000", "http://localhost:5173", "https://yourdomain.com"], "rateLimitPerMinute": 3000}' | jq '{ message: .message, allowed_domains: .data.allowedDomains, rate_limit: .data.rateLimitPerMinute }'

echo -e "\n=================================================="
echo "✓ All 6 API operations completed successfully!"
echo "=================================================="`;

  const handleDownloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentLeaderboard?.name || "Leaderboard"} - Thrico Leaderboard</title>
</head>
<body style="margin: 0; padding: 32px 16px; background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; min-height: 100vh;">
${htmlSnippet}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leaderboard-${lbCode}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded leaderboard-${lbCode}.html`);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([shSnippet], { type: "text/x-sh" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-leaderboard-${lbCode}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded test-leaderboard-${lbCode}.sh`);
  };

  // 3. Raw REST Endpoints
  const restSnippet = `# 1. Request Short-Lived JWT Token (Bearer)
curl -X POST "https://thrico-tracking.thrico.app/v1/sdk/auth/token" \\
  -H "Content-Type: application/json" \\
  -H "Origin: https://yourdomain.com" \\
  -d '{"clientId": "${clientId}"}'

# 2. Fetch Top 3 Podium
curl -X GET "https://thrico-tracking.thrico.app/v1/sdk/leaderboards/${lbCode}/top?limit=3" \\
  -H "Authorization: Bearer <TOKEN>"

# 3. Fetch Paginated Entries
curl -X GET "https://thrico-tracking.thrico.app/v1/sdk/leaderboards/${lbCode}/entries?page=1&limit=20" \\
  -H "Authorization: Bearer <TOKEN>"

# 4. Fetch Current User Rank
curl -X GET "https://thrico-tracking.thrico.app/v1/sdk/leaderboards/${lbCode}/me" \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "X-User-Id: <USER_ID>"

# 5. Update Leaderboard Configuration
curl -X PATCH "https://thrico-tracking.thrico.app/v1/sdk/leaderboards/${lbCode}" \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "${currentLeaderboard?.name || "Updated Name"}",
    "status": "ACTIVE",
    "badgeVisibility": true
  }'

# 6. Update Allowed Domains & Rate Limit Settings
curl -X PATCH "https://thrico-tracking.thrico.app/v1/sdk/settings" \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "allowedDomains": ["http://localhost:3000", "https://yourdomain.com"],
    "rateLimitPerMinute": 3000
  }'`;

  const handleCopy = (text: string, tabKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabKey);
    toast.success("Snippet copied to clipboard!");
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── Selector Header ───────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                Embed & SDK Code Generator
                <Badge variant="outline" className="text-[10px] font-mono border-purple-500/30 text-purple-600 dark:text-purple-400">
                  Headless v1.0
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Generate tailored client code with your Client ID and selected leaderboard code pre-filled.
              </p>
            </div>
          </div>

          {leaderboards.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-medium text-muted-foreground shrink-0">
                Target Board:
              </span>
              <Select value={lbCode} onValueChange={setActiveCode}>
                <SelectTrigger className="h-8 text-xs font-mono bg-background min-w-[200px]">
                  <SelectValue placeholder="Select leaderboard" />
                </SelectTrigger>
                <SelectContent>
                  {leaderboards.map((lb) => (
                    <SelectItem key={lb.id} value={lb.code} className="text-xs font-mono">
                      {lb.name} ({lb.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Selected Config Info Pill */}
        {currentLeaderboard && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border/80 bg-muted/20 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>{currentLeaderboard.name}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="font-mono text-primary text-[11px]">
                code: {currentLeaderboard.code}
              </span>
              <span className="text-muted-foreground">•</span>
              <Badge variant="secondary" className="text-[10px] py-0">
                {currentLeaderboard.periodType}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground text-[11px]">
                Page Size: {currentLeaderboard.defaultPageSize} (Max: {currentLeaderboard.maxPageSize})
              </span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadHtml}
              className="h-7 text-xs gap-1.5 bg-background hover:bg-muted font-medium ml-auto sm:ml-0"
              title="Download standalone HTML file ready to open in any browser"
            >
              <Download className="h-3.5 w-3.5 text-amber-500" />
              Download HTML
            </Button>
          </div>
        )}
      </div>

      {/* ── Code Tabs ─────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Tabs defaultValue="html" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border bg-muted/30 px-4 py-2 gap-2">
            <TabsList className="bg-muted p-0.5 rounded-lg border border-border h-8">
              <TabsTrigger value="html" className="text-xs h-7 px-3 gap-1.5 font-medium">
                <Layout className="h-3.5 w-3.5 text-amber-500" />
                Complete HTML Widget
              </TabsTrigger>
              <TabsTrigger value="cdn" className="text-xs h-7 px-3 gap-1.5 font-medium">
                <Globe className="h-3.5 w-3.5" />
                Headless JS (CDN)
              </TabsTrigger>
              <TabsTrigger value="rest" className="text-xs h-7 px-3 gap-1.5 font-medium">
                <Terminal className="h-3.5 w-3.5" />
                REST API (Curl)
              </TabsTrigger>
              <TabsTrigger value="sh" className="text-xs h-7 px-3 gap-1.5 font-medium">
                <FileCode2 className="h-3.5 w-3.5 text-emerald-500" />
                Automated Test Script (.sh)
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                Auto-configured with <code className="font-mono text-primary">{clientId.slice(0, 16)}...</code>
              </span>
            </div>
          </div>

          {/* HTML Drop-in Widget Tab Content */}
          <TabsContent value="html" className="p-0 m-0">
            <div className="relative group">
              <div className="p-2.5 bg-muted/50 border-b border-border text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Copy & paste this complete self-contained HTML/CSS/JS block into any website, CMS, or blog page.</span>
                <span className="font-mono text-[10px] text-primary">Zero dependencies</span>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono bg-zinc-950 text-zinc-100 leading-relaxed max-h-[420px]">
                <code>{htmlSnippet}</code>
              </pre>
              <div className="absolute top-12 right-3 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleDownloadHtml}
                  className="h-8 gap-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-md"
                  title="Download self-contained leaderboard.html file"
                >
                  <Download className="h-3.5 w-3.5 text-amber-400" />
                  Download .html
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCopy(htmlSnippet, "html")}
                  className="h-8 gap-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-md"
                >
                  {copiedTab === "html" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy HTML Widget
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* CDN Tab Content */}
          <TabsContent value="cdn" className="p-0 m-0">
            <div className="relative group">
              <pre className="p-4 overflow-x-auto text-xs font-mono bg-zinc-950 text-zinc-100 leading-relaxed max-h-[380px]">
                <code>{cdnSnippet}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleCopy(cdnSnippet, "cdn")}
                className="absolute top-3 right-3 h-8 gap-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-md"
              >
                {copiedTab === "cdn" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Headless JS
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* REST API Tab Content */}
          <TabsContent value="rest" className="p-0 m-0">
            <div className="relative group">
              <pre className="p-4 overflow-x-auto text-xs font-mono bg-zinc-950 text-zinc-100 leading-relaxed max-h-[380px]">
                <code>{restSnippet}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleCopy(restSnippet, "rest")}
                className="absolute top-3 right-3 h-8 gap-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-md"
              >
                {copiedTab === "rest" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Endpoints
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Automated Bash Script Tab Content */}
          <TabsContent value="sh" className="p-0 m-0">
            <div className="relative group">
              <div className="p-2.5 bg-muted/50 border-b border-border text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Run this complete script in your terminal to test token issuance, queries, and configuration updates against the live API.</span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Ready to run (bash)</span>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono bg-zinc-950 text-zinc-100 leading-relaxed max-h-[420px]">
                <code>{shSnippet}</code>
              </pre>
              <div className="absolute top-12 right-3 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleDownloadScript}
                  className="h-8 gap-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-md"
                >
                  <Download className="h-3.5 w-3.5 text-primary" />
                  Download .sh
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCopy(shSnippet, "sh")}
                  className="h-8 gap-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-md"
                >
                  {copiedTab === "sh" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Script
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Live Visual UI Preview (Demonstrates Data Delivery) ───────────── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500" />
              SDK Data Rendering Preview
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Mock presentation of how data from <code className="font-mono text-primary">{lbCode}</code> renders in client DOM.
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] bg-muted/40">
            Zero-Iframe Native DOM
          </Badge>
        </div>

        {/* Podium Simulation */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* Rank 2 (Silver) */}
          <div className="flex flex-col items-center justify-end p-3 rounded-lg border border-border/70 bg-muted/20 text-center">
            <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-200 text-xs shadow-xs mb-2">
              #2
            </div>
            <span className="text-xs font-semibold text-foreground truncate w-full">Priya Sharma</span>
            <span className="text-[11px] font-mono text-muted-foreground">9,420 pts</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +2
            </span>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="flex flex-col items-center justify-end p-4 rounded-xl border-2 border-amber-500/40 bg-amber-500/10 text-center shadow-xs">
            <Crown className="h-5 w-5 text-amber-500 mb-1" />
            <div className="h-12 w-12 rounded-full bg-amber-500 text-white font-bold text-sm shadow-md flex items-center justify-center mb-2 ring-4 ring-amber-500/20">
              #1
            </div>
            <span className="text-xs font-bold text-foreground truncate w-full">Rahul Verma</span>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">12,850 pts</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> Leader
            </span>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="flex flex-col items-center justify-end p-3 rounded-lg border border-border/70 bg-muted/20 text-center">
            <div className="h-10 w-10 rounded-full bg-amber-700/20 text-amber-700 dark:text-amber-500 flex items-center justify-center font-bold text-xs shadow-xs mb-2">
              #3
            </div>
            <span className="text-xs font-semibold text-foreground truncate w-full">Amit Patel</span>
            <span className="text-[11px] font-mono text-muted-foreground">8,910 pts</span>
            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-0.5 mt-1">
              — 0
            </span>
          </div>
        </div>

        {/* Sticky "My Rank" Simulation Bar */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5 text-xs">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">
              Client Logged-in User Rank:
            </span>
            <span className="font-mono font-bold text-primary">#127</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-muted-foreground">4,820 points</span>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
              +8 positions today
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
