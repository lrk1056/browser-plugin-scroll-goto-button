// 检查是否是特殊协议页面，这些页面无法注入脚本
function isRestrictedPage(url) {
  if (!url) return true;
  const restrictedProtocols = [
    'chrome:',
    'chrome-extension:',
    'edge:',
    'brave:',
    'about:',
    'file:',
    'data:',
    'javascript:'
  ];
  return restrictedProtocols.some(protocol => url.startsWith(protocol));
}

// 显示错误提示
function showError(message) {
  // 移除可能存在的旧提示
  const oldError = document.querySelector('.error-message');
  if (oldError) oldError.remove();

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  document.querySelector('.container').appendChild(errorDiv);

  // 3秒后自动移除提示
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

// 获取当前活动标签页并执行脚本
async function scrollToPosition(position) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) {
      console.log('没有找到活动标签页');
      return;
    }

    // 检查是否是特殊页面
    if (isRestrictedPage(tab.url)) {
      showError('无法在浏览器内置页面使用此功能');
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (pos) => {
        const scrollHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );
        const clientHeight = document.documentElement.clientHeight;
        let targetPosition;

        switch (pos) {
          case 'top':
            targetPosition = 0;
            break;
          case 'middle':
            targetPosition = (scrollHeight - clientHeight) / 2;
            break;
          case 'bottom':
            targetPosition = scrollHeight - clientHeight;
            break;
        }

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      },
      args: [position]
    });
  } catch (error) {
    console.error('滚动失败:', error);
  }
}

// 绑定按钮事件
document.getElementById('btn-top').addEventListener('click', () => {
  scrollToPosition('top');
});

document.getElementById('btn-middle').addEventListener('click', () => {
  scrollToPosition('middle');
});

document.getElementById('btn-bottom').addEventListener('click', () => {
  scrollToPosition('bottom');
});