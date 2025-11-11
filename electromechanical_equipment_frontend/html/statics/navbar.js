// navbar.js

// 加载并插入导航栏
function loadNavbar() {
    // 将 username、identity 和 avatarUrl 作为查询参数传递给 navbar.html
    const params = new URLSearchParams({
        username: username,
        identity: identity,
        avatarUrl: avatarUrl
    });

    fetch(`./static/navbar.html?${params.toString()}`)
        .then(response => response.text())
        .then(data => {
            // 插入导航栏 HTML 到占位元素
            document.getElementById('nav-placeholder').innerHTML = data;

            // 重新初始化导航栏的 JavaScript 功能
            const sidebar = document.getElementById('sidebar');
            const toggleSidebar = document.getElementById('toggleSidebar');

            toggleSidebar.addEventListener('click', () => {
                if (sidebar.style.left === '0px') {
                    sidebar.style.left = '-200px';
                    toggleSidebar.style.left = '20px';
                    toggleSidebar.classList.remove('open');
                } else {
                    sidebar.style.left = '0px';
                    toggleSidebar.style.left = '200px';
                    toggleSidebar.classList.add('open');
                }
            });

            // 使用从查询参数获取的 username、identity 和 avatarUrl
            const identityMap = {
                'admin': '管理员',
                'maintainer': '维护人员',
                'visitor': '访客'
            };
            const identityChinese = identityMap[identity] || '未知身份';

            document.getElementById('username').textContent = `${username}`;
            document.getElementById('role').textContent = `身份：${identityChinese}`;

            const avatar = document.getElementById('avatar');
            const avatarUpload = document.getElementById('avatar-upload');

            if (avatarUrl) {
                avatar.style.backgroundImage = `url('${avatarUrl}?${new Date().getTime()}')`;
                avatar.style.backgroundSize = 'cover';
                avatar.innerHTML = '';
            }

            avatar.addEventListener('click', () => {
                avatarUpload.click();
            });

            avatarUpload.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('avatar', file);
                    formData.append('username', username);

                    fetch('/upload_avatar', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            avatar.style.backgroundImage = `url('${data.avatar_url}?${new Date().getTime()}')`;
                            avatar.style.backgroundSize = 'cover';
                            avatar.innerHTML = '';
                        } else {
                            alert('上传失败，请重试');
                        }
                    })
                    .catch(error => console.error('上传失败:', error));
                }
            });
        })
        .catch(error => console.error('Error loading navbar:', error));
}

document.addEventListener('DOMContentLoaded', loadNavbar);