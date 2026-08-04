const fs = require('fs');
let code = fs.readFileSync('components/layout/sidebar/sidebar.tsx', 'utf8');

const headerStart = code.indexOf('{/* ── NAVBAR ── */}');
const headerEnd = code.indexOf('</header>') + '</header>'.length;
const headerCode = code.substring(headerStart, headerEnd);

// Remove header from its current location
code = code.substring(0, headerStart) + code.substring(headerEnd);

// Find insertion point (after SwitchingLoader)
const insertPointStr = 'targetWorkspaceName={targetName}\n      />\n';
const insertIndex = code.indexOf(insertPointStr) + insertPointStr.length;

// Wrap Sidebar and SidebarInset in a div
code = code.substring(0, insertIndex) + 
  '      ' + headerCode + '\n' +
  '      <div className="flex flex-1 relative w-full group/sidebar-wrapper">\n' + 
  code.substring(insertIndex);

const insetEnd = code.indexOf('</SidebarInset>') + '</SidebarInset>'.length;
code = code.substring(0, insetEnd) + '\n      </div>\n' + code.substring(insetEnd);

// Change the return <> to return <div className="flex flex-col flex-1 min-w-0 w-full">
code = code.replace('return (\n    <>\n', 'return (\n    <div className="flex flex-col flex-1 min-w-0 w-full">\n');
code = code.replace('</CommandDialog>\n    </>\n', '</CommandDialog>\n    </div>\n');

// Update Sidebar to have !top-[56px] !h-[calc(100vh-56px)]
code = code.replace('transition-[width] duration-150 ease-in-out !left-[72px]"', 'transition-[width] duration-150 ease-in-out !left-[72px] !top-[56px] !h-[calc(100vh-56px)]"');

fs.writeFileSync('components/layout/sidebar/sidebar.tsx', code);
console.log("Transformed!");
