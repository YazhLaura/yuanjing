import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image, Type, Layout, Download, Plus, Trash2, Edit, ArrowLeft } from 'lucide-react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';

// 定义更精致的莫兰迪色系与渐变
const morandiColors = {
  primary: '#e8e1d9', // 更浅的莫兰迪奶茶色
  secondary: '#dad2c9', // 浅莫兰迪棕
  accent: '#d9cabc', // 浅莫兰迪米色
  highlight: '#c2b8a3', // 莫兰迪灰棕
  text: '#6e665d', // 莫兰迪深棕灰
  lightBg: '#f4f1ee', // 超浅莫兰迪背景
  mediumBg: '#ebe6e1', // 浅莫兰迪背景
  darkAccent: '#988f82', // 深莫兰迪棕
  green: '#c5ccba', // 浅莫兰迪绿
  blue: '#bcc7d1', // 浅莫兰迪蓝
  pink: '#e1d3cd', // 浅莫兰迪粉
  lilac: '#d7d3dd', // 浅莫兰迪丁香紫
  sage: '#ccd5c8', // 浅莫兰迪鼠尾草绿
};

// 定义渐变组合
const gradients = {
  primary: 'linear-gradient(135deg, #e8e1d9 0%, #d9cabc 100%)',
  header: 'linear-gradient(135deg, #dad2c9 0%, #c2b8a3 100%)',
  accent: 'linear-gradient(135deg, #d7d3dd 0%, #bcc7d1 100%)',
  button: 'linear-gradient(135deg, #d9cabc 0%, #c2b8a3 100%)',
  card: 'linear-gradient(135deg, #f4f1ee 0%, #ebe6e1 100%)',
  green: 'linear-gradient(135deg, #ccd5c8 0%, #c5ccba 100%)',
  homeBg: 'linear-gradient(135deg, #f4f1ee 0%, #e1d3cd 100%)',
  visionCard: 'linear-gradient(135deg, #d7d3dd 10%, #bcc7d1 90%)',
  wallpaperCard: 'linear-gradient(135deg, #ccd5c8 10%, #c5ccba 90%)',
};

// 主应用组件
const VisionBoardCreator = () => {
  // 状态管理
  const [activePage, setActivePage] = useState('home'); // 'home', 'editor'
  const [activeTab, setActiveTab] = useState('visionBoard'); // 'visionBoard' 或 'wallpaper'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [texts, setTexts] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [currentText, setCurrentText] = useState({ text: '', fontSize: 24, color: '#ffffff', bgColor: 'transparent', id: null });
  const [stockImages, setStockImages] = useState([]);
  const [stockQuotes, setStockQuotes] = useState([]);
  const [deviceType, setDeviceType] = useState('desktop'); // 'desktop' 或 'mobile'
  const [editingTextId, setEditingTextId] = useState(null);
  const [activeStockTab, setActiveStockTab] = useState('images'); // 'images' 或 'quotes'
  const [savedCreations, setSavedCreations] = useState([]);
  const previewRef = useRef(null);

  // 模板配置
  const templates = {
    visionBoard: [
      { id: 'grid2x2', name: '2x2网格', layout: '2x2' },
      { id: 'grid3x3', name: '3x3网格', layout: '3x3' },
      { id: 'collage1', name: '拼贴风格1', layout: 'collage' },
      { id: 'collage2', name: '拼贴风格2', layout: 'collage2' }
    ],
    wallpaper: [
      { id: 'desktopSimple', name: '简约桌面', layout: 'simple', type: 'desktop' },
      { id: 'mobileCentered', name: '居中手机壁纸', layout: 'centered', type: 'mobile' },
      { id: 'desktopCollage', name: '桌面拼贴', layout: 'collage', type: 'desktop' },
      { id: 'mobileCollage', name: '手机拼贴', layout: 'collage', type: 'mobile' }
    ]
  };

  // 从localStorage加载保存的创作
  useEffect(() => {
    const savedData = localStorage.getItem('yuanjing-creations');
    if (savedData) {
      try {
        setSavedCreations(JSON.parse(savedData));
      } catch (e) {
        console.error('无法加载保存的创作', e);
      }
    }
  }, []);

  // 初始化库存素材
  useEffect(() => {
    // 更丰富的图片素材
    setStockImages([
      { id: 's1', url: '/api/placeholder/400/320', alt: '成功目标' },
      { id: 's2', url: '/api/placeholder/400/320', alt: '自然风光' },
      { id: 's3', url: '/api/placeholder/400/320', alt: '冥想平静' },
      { id: 's4', url: '/api/placeholder/400/320', alt: '健康生活' },
      { id: 's5', url: '/api/placeholder/400/320', alt: '财富自由' },
      { id: 's6', url: '/api/placeholder/400/320', alt: '爱与关怀' },
      { id: 's7', url: '/api/placeholder/400/320', alt: '职业成长' },
      { id: 's8', url: '/api/placeholder/400/320', alt: '旅行探索' },
      { id: 's9', url: '/api/placeholder/400/320', alt: '学习提升' },
      { id: 's10', url: '/api/placeholder/400/320', alt: '家庭幸福' },
      { id: 's11', url: '/api/placeholder/400/320', alt: '创意灵感' },
      { id: 's12', url: '/api/placeholder/400/320', alt: '友谊连接' },
    ]);

    // 更丰富的激励文案
    setStockQuotes([
      { id: 'q1', text: '相信自己，你能做到一切！' },
      { id: 'q2', text: '每一天都是新的开始和机会' },
      { id: 'q3', text: '持续努力，终将收获成功的果实' },
      { id: 'q4', text: '梦想不会自己实现，行动才是实现的桥梁' },
      { id: 'q5', text: '感恩所有，拥抱每一天的美好' },
      { id: 'q6', text: '勇敢追求梦想，无所畏惧地前行' },
      { id: 'q7', text: '专注当下，珍惜现在的每一刻' },
      { id: 'q8', text: '生活中最大的冒险是追随内心的声音' },
      { id: 'q9', text: '无论多远的路，都始于脚下的一步' },
      { id: 'q10', text: '内心平静是最强大的财富' },
      { id: 'q11', text: '态度决定高度，思维决定出路' },
      { id: 'q12', text: '做更好的自己，而不是别人眼中的完美' },
    ]);
  }, []);

  // 选择创作类型并进入编辑页面
  const handleSelectCreate = (type) => {
    setActiveTab(type);
    // 重置当前的编辑状态
    setSelectedTemplate(null);
    setUserImages([]);
    setTexts([]);
    setActivePage('editor');
  };

  // 返回主页
  const handleBackToHome = () => {
    setActivePage('home');
  };

  // 处理图片上传
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImages([...userImages, { 
          id: Date.now().toString(), 
          url: event.target.result, 
          alt: file.name,
          position: { x: 0, y: 0 }
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  // 添加在线图片URL
  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      setUserImages([...userImages, { 
        id: Date.now().toString(), 
        url: imageUrl, 
        alt: 'Online Image',
        position: { x: 0, y: 0 }
      }]);
      setImageUrl('');
      setShowImageModal(false);
    }
  };

  // 添加库存图片
  const handleAddStockImage = (image) => {
    setUserImages([...userImages, { 
      ...image, 
      id: Date.now().toString(),
      position: { x: 0, y: 0 }
    }]);
  };

  // 添加或更新文字
  const handleAddText = () => {
    if (currentText.text.trim()) {
      if (editingTextId) {
        // 更新已有文字
        setTexts(texts.map(t => t.id === editingTextId ? { 
          ...currentText, 
          id: editingTextId 
        } : t));
      } else {
        // 添加新文字
        setTexts([...texts, { 
          ...currentText, 
          id: Date.now().toString(),
          position: { x: Math.random() * 100, y: Math.random() * 100 }
        }]);
      }
      setCurrentText({ text: '', fontSize: 24, color: '#ffffff', bgColor: 'transparent', id: null });
      setEditingTextId(null);
      setShowTextModal(false);
    }
  };

  // 编辑文字
  const handleEditText = (id) => {
    const textToEdit = texts.find(t => t.id === id);
    if (textToEdit) {
      setCurrentText({ ...textToEdit });
      setEditingTextId(id);
      setShowTextModal(true);
    }
  };

  // 添加库存文案
  const handleAddStockQuote = (quote) => {
    setTexts([...texts, {
      id: Date.now().toString(),
      text: quote.text,
      fontSize: 24,
      color: '#ffffff',
      bgColor: 'rgba(0,0,0,0.5)',
      position: { x: Math.random() * 100, y: Math.random() * 100 }
    }]);
  };

  // 删除图片
  const handleDeleteImage = (id) => {
    setUserImages(userImages.filter(img => img.id !== id));
  };

  // 删除文字
  const handleDeleteText = (id) => {
    setTexts(texts.filter(t => t.id !== id));
  };

  // 处理文字拖拽结束
  const handleTextDragStop = (id, e, data) => {
    setTexts(texts.map(text => 
      text.id === id ? { ...text, position: { x: data.x, y: data.y } } : text
    ));
  };

  // 处理图片拖拽结束
  const handleImageDragStop = (id, e, data) => {
    setUserImages(userImages.map(img => 
      img.id === id ? { ...img, position: { x: data.x, y: data.y } } : img
    ));
  };

  // 保存创作到localStorage
  const saveCreation = () => {
    if (!selectedTemplate) {
      alert("请先选择一个模板");
      return;
    }

    const newCreation = {
      id: Date.now().toString(),
      type: activeTab,
      template: selectedTemplate,
      images: userImages,
      texts: texts,
      deviceType: deviceType,
      createdAt: new Date().toISOString()
    };

    const updatedCreations = [...savedCreations, newCreation];
    setSavedCreations(updatedCreations);
    localStorage.setItem('yuanjing-creations', JSON.stringify(updatedCreations));
    
    alert("您的创作已保存！");
  };

  // 生成并下载愿景板或壁纸
  const handleDownload = () => {
    if (!previewRef.current || !selectedTemplate) {
      alert("请先选择一个模板并添加内容");
      return;
    }

    const scale = 2; // 提高输出质量
    const options = {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: 'white'
    };

    html2canvas(previewRef.current, options).then(canvas => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `愿景_${new Date().getTime()}.png`;
      link.click();
    });
  };

  // 渲染2x2模板布局
  const renderGrid2x2 = () => (
    <div className="grid grid-cols-2 gap-3 w-full h-full">
      {userImages.slice(0, 4).map((image, index) => (
        <div key={image.id} className="relative overflow-hidden rounded-lg shadow-sm">
          <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
          <button 
            className="absolute top-2 right-2 p-1 rounded-full shadow-sm opacity-80 hover:opacity-100 z-20 cursor-pointer" 
            style={{ background: gradients.accent, position: 'relative' }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteImage(image.id);
            }}
          >
            <Trash2 size={16} color="white" />
          </button>
        </div>
      ))}
      {texts.map((text) => (
        <Draggable 
          key={text.id} 
          onStop={(e, data) => handleTextDragStop(text.id, e, data)}
          defaultPosition={text.position}
        >
          <div 
            className="absolute p-3 rounded-lg cursor-move shadow-sm"
            style={{ 
              color: text.color, 
              fontSize: `${text.fontSize}px`,
              backgroundColor: text.bgColor,
              zIndex: 10,
              position: 'absolute',
              userSelect: 'none'
            }}
          >
            {text.text}
            <div className="flex gap-2 mt-2 opacity-80">
              <button 
                className="p-1 rounded-full z-20 cursor-pointer" 
                style={{ background: gradients.blue, position: 'relative' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditText(text.id);
                }}
              >
                <Edit size={12} color="white" />
              </button>
              <button 
                className="p-1 rounded-full z-20 cursor-pointer" 
                style={{ background: gradients.accent, position: 'relative' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteText(text.id);
                }}
              >
                <Trash2 size={12} color="white" />
              </button>
            </div>
          </div>
        </Draggable>
      ))}
    </div>
  );

  // 渲染3x3模板布局
  const renderGrid3x3 = () => (
    <div className="grid grid-cols-3 gap-1 w-full h-full">
      {userImages.slice(0, 9).map((image, index) => (
        <div key={image.id} className="relative overflow-hidden rounded-lg shadow-sm">
          <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
          <button 
            className="absolute top-2 right-2 p-1 rounded-full shadow-sm opacity-80 hover:opacity-100 z-20 cursor-pointer" 
            style={{ background: gradients.accent, position: 'relative' }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteImage(image.id);
            }}
          >
            <Trash2 size={16} color="white" />
          </button>
        </div>
      ))}
      {texts.map((text) => (
        <Draggable 
          key={text.id} 
          onStop={(e, data) => handleTextDragStop(text.id, e, data)}
          defaultPosition={text.position}
        >
          <div 
            className="absolute p-3 rounded-lg cursor-move shadow-sm"
            style={{ 
              color: text.color, 
              fontSize: `${text.fontSize}px`,
              backgroundColor: text.bgColor,
              zIndex: 10,
              position: 'absolute',
              userSelect: 'none'
            }}
          >
            {text.text}
            <div className="flex gap-2 mt-2 opacity-80">
              <button 
                className="p-1 rounded-full z-20 cursor-pointer" 
                style={{ background: gradients.blue, position: 'relative' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditText(text.id);
                }}
              >
                <Edit size={12} color="white" />
              </button>
              <button 
                className="p-1 rounded-full z-20 cursor-pointer" 
                style={{ background: gradients.accent, position: 'relative' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteText(text.id);
                }}
              >
                <Trash2 size={12} color="white" />
              </button>
            </div>
          </div>
        </Draggable>
      ))}
    </div>
  );

  // 渲染壁纸布局
  const renderWallpaper = () => {
    const isDesktop = deviceType === 'desktop';
    return (
      <div className={`relative ${isDesktop ? 'w-full h-64' : 'w-64 h-full'} bg-gray-800 overflow-hidden rounded-lg`}>
        {userImages.length > 0 && (
          <div className="absolute inset-0">
            <img src={userImages[0].url} alt={userImages[0].alt} className="w-full h-full object-cover" />
          </div>
        )}
        {texts.map((text) => (
          <Draggable 
            key={text.id} 
            onStop={(e, data) => handleTextDragStop(text.id, e, data)}
            defaultPosition={text.position}
          >
            <div 
              className="absolute p-3 rounded-lg cursor-move shadow-sm"
              style={{ 
                color: text.color, 
                fontSize: `${text.fontSize}px`,
                backgroundColor: text.bgColor,
                zIndex: 10,
                position: 'absolute',
                userSelect: 'none'
              }}
            >
              {text.text}
              <div className="flex gap-2 mt-2 opacity-80">
                <button 
                  className="p-1 rounded-full z-20 cursor-pointer" 
                  style={{ background: gradients.blue, position: 'relative' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditText(text.id);
                  }}
                >
                  <Edit size={12} color="white" />
                </button>
                <button 
                  className="p-1 rounded-full z-20 cursor-pointer" 
                  style={{ background: gradients.accent, position: 'relative' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteText(text.id);
                  }}
                >
                  <Trash2 size={12} color="white" />
                </button>
              </div>
            </div>
          </Draggable>
        ))}
      </div>
    );
  };

  // 根据选择的模板渲染不同布局
  const renderTemplate = () => {
    if (!selectedTemplate) return (
      <div className="flex items-center justify-center w-full h-64 rounded-lg" 
        style={{ 
          background: gradients.card, 
          border: `2px dashed ${morandiColors.secondary}`
        }}>
        <div className="text-center">
          <p style={{ color: morandiColors.darkAccent }}>请选择一个模板</p>
          <button 
            className="mt-4 px-5 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md z-10 cursor-pointer"
            style={{ 
              background: gradients.button,
              color: 'white',
              position: 'relative'
            }}
            onClick={() => setShowTemplateModal(true)}
          >
            选择模板
          </button>
        </div>
      </div>
    );

    if (activeTab === 'visionBoard') {
      switch (selectedTemplate.layout) {
        case '2x2': return renderGrid2x2();
        case '3x3': return renderGrid3x3();
        case 'collage': 
        case 'collage2': 
        default: return renderGrid2x2();
      }
    } else { // wallpaper
      return renderWallpaper();
    }
  };

  // 渲染主页
  const renderHomePage = () => (
    <div className="flex flex-col min-h-screen w-full" style={{ background: gradients.homeBg }}>
      {/* 头部 */}
      <header className="p-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-light mb-6 text-center" style={{ color: morandiColors.text }}>
          愿·景<span className="block text-xl mt-1 font-light opacity-80">创造你的视觉灵感</span>
        </h1>
        <p className="text-center max-w-lg text-lg leading-relaxed mb-10" style={{ color: morandiColors.darkAccent }}>
          将你的目标和梦想可视化，创建精美的愿景板和个性化壁纸
        </p>
      </header>

      {/* 选择卡片 */}
      <main className="flex-1 w-full px-4 flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-4xl">
          {/* 愿景板卡片 */}
          <div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
            onClick={() => handleSelectCreate('visionBoard')}
            style={{ position: 'relative', zIndex: 5 }}
          >
            <div className="h-56 relative" style={{ background: gradients.visionCard }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-90">
                <div className="grid grid-cols-2 gap-2 w-40 h-40">
                  <div className="bg-white rounded-lg shadow"></div>
                  <div className="bg-white rounded-lg shadow"></div>
                  <div className="bg-white rounded-lg shadow"></div>
                  <div className="bg-white rounded-lg shadow"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-medium mb-2" style={{ color: morandiColors.text }}>创建愿景板</h2>
              <p className="opacity-75" style={{ color: morandiColors.darkAccent }}>
                设计多图拼贴，将你的目标和梦想可视化
              </p>
            </div>
          </div>

          {/* 壁纸卡片 */}
          <div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
            onClick={() => handleSelectCreate('wallpaper')}
            style={{ position: 'relative', zIndex: 5 }}
          >
            <div className="h-56 relative" style={{ background: gradients.wallpaperCard }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-90">
                <div className="w-32 h-56 bg-white rounded-lg shadow mr-4 flex items-center justify-center">
                  <div className="w-24 h-10 rounded" style={{ background: morandiColors.darkAccent, opacity: 0.5 }}></div>
                </div>
                <div className="w-56 h-32 bg-white rounded-lg shadow flex items-center justify-center">
                  <div className="w-40 h-10 rounded" style={{ background: morandiColors.darkAccent, opacity: 0.5 }}></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-medium mb-2" style={{ color: morandiColors.text }}>创建壁纸</h2>
              <p className="opacity-75" style={{ color: morandiColors.darkAccent }}>
                设计手机和电脑壁纸，每天提醒自己的目标
              </p>
            </div>
          </div>
        </div>

        {/* 显示保存的创作 */}
        {savedCreations.length > 0 && (
          <div className="mt-16 w-full max-w-4xl">
            <h2 className="text-2xl font-medium mb-6" style={{ color: morandiColors.text }}>我的创作</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {savedCreations.map(creation => (
                <div 
                  key={creation.id}
                  className="bg-white rounded-lg shadow overflow-hidden cursor-pointer"
                  style={{ position: 'relative', zIndex: 5 }}
                  onClick={() => {
                    // 加载已保存的创作
                    setActiveTab(creation.type);
                    setSelectedTemplate(creation.template);
                    setUserImages(creation.images);
                    setTexts(creation.texts);
                    if (creation.type === 'wallpaper') {
                      setDeviceType(creation.deviceType);
                    }
                    setActivePage('editor');
                  }}
                >
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    {/* 这里可以放预览图，现在用占位符 */}
                    <div className="text-xs text-center p-2" style={{ color: morandiColors.darkAccent }}>
                      {creation.type === 'visionBoard' ? '愿景板' : '壁纸'}
                      <br />
                      {new Date(creation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="p-6 text-center mt-6" style={{ background: gradients.header, color: morandiColors.darkAccent }}>
        <p>愿·景 &copy; 2025</p>
      </footer>
    </div>
  );

  // 渲染编辑页面
  const renderEditorPage = () => (
    <div className="flex flex-col min-h-screen w-full" style={{ background: gradients.card }}>
      {/* 编辑器头部 */}
      <header className="p-6" style={{ background: gradients.header }}>
        <div className="w-full max-w-7xl mx-auto flex items-center">
          <button 
            className="mr-4 p-2 rounded-full transition-all duration-200 hover:bg-white hover:bg-opacity-20 cursor-pointer"
            style={{ position: 'relative', zIndex: 20 }}
            onClick={handleBackToHome}
          >
            <ArrowLeft size={20} color={morandiColors.text} />
          </button>
          <h1 className="text-2xl font-semibold" style={{ color: morandiColors.text }}>
            {activeTab === 'visionBoard' ? '愿·景 创建' : '壁纸创建'}
          </h1>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4">
        {/* 功能按钮区 */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-amber-800 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
            style={{ background: gradients.button, position: 'relative', zIndex: 20 }}
            onClick={() => setShowTemplateModal(true)}
          >
            <Layout size={18} />
            选择模板
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-amber-800 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
            style={{ background: gradients.accent, position: 'relative', zIndex: 20 }}
            onClick={() => setShowImageModal(true)}
          >
            <Image size={18} />
            添加图片
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-amber-800 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
            style={{ background: gradients.green, position: 'relative', zIndex: 20 }}
            onClick={() => setShowTextModal(true)}
          >
            <Type size={18} />
            添加文字
          </button>
          {activeTab === 'wallpaper' && (
            <div className="flex gap-3 ml-2">
              <button 
                className="px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                style={{ 
                  background: deviceType === 'desktop' ? gradients.green : morandiColors.mediumBg,
                  color: deviceType === 'desktop' ? 'white' : morandiColors.text,
                  position: 'relative',
                  zIndex: 20
                }}
                onClick={() => setDeviceType('desktop')}
              >
                电脑壁纸
              </button>
              <button 
                className="px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                style={{ 
                  background: deviceType === 'mobile' ? gradients.accent : morandiColors.mediumBg,
                  color: deviceType === 'mobile' ? 'white' : morandiColors.text,
                  position: 'relative',
                  zIndex: 20
                }}
                onClick={() => setDeviceType('mobile')}
              >
                手机壁纸
              </button>
            </div>
          )}
        </div>

        {/* 预览区 */}
        <div className="rounded-xl p-6 shadow-sm mb-8" style={{ background: 'white', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <h2 className="text-xl font-medium mb-4" style={{ color: morandiColors.text }}>预览</h2>
          <div 
            ref={previewRef}
            className={`relative ${activeTab === 'wallpaper' && deviceType === 'mobile' ? 'h-96 flex justify-center' : 'w-full'}`}
          >
            {renderTemplate()}
          </div>
        </div>

        {/* 下载和保存按钮 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-sm text-white transition-all duration-200 hover:shadow-md cursor-pointer"
            style={{ background: gradients.button, position: 'relative', zIndex: 20 }}
            onClick={handleDownload}
          >
            <Download size={18} />
            下载成品
          </button>
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
            style={{ background: morandiColors.sage, color: morandiColors.text, position: 'relative', zIndex: 20 }}
            onClick={saveCreation}
          >
            <Plus size={18} />
            保存创作
          </button>
        </div>

        {/* 素材库显示 */}
        <div className="rounded-xl p-6 shadow-sm" style={{ background: 'white', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <h2 className="text-xl font-medium mb-4" style={{ color: morandiColors.text }}>素材库</h2>
          
          {/* 素材选项卡 */}
          <div className="flex mb-6" style={{ borderBottom: `1px solid ${morandiColors.mediumBg}` }}>
            <button 
              className={`py-2 px-5 rounded-t-lg font-medium ${activeStockTab === 'images' ? 'border-b-2' : ''} cursor-pointer`}
              style={{ 
                borderColor: morandiColors.accent,
                color: activeStockTab === 'images' ? morandiColors.darkAccent : morandiColors.text,
                backgroundColor: activeStockTab === 'images' ? morandiColors.mediumBg : 'transparent',
                position: 'relative',
                zIndex: 20
              }}
              onClick={() => setActiveStockTab('images')}
            >
              图片素材
            </button>
            <button 
              className={`py-2 px-5 font-medium ${activeStockTab === 'quotes' ? 'border-b-2' : ''} cursor-pointer`}
              style={{ 
                borderColor: morandiColors.accent,
                color: activeStockTab === 'quotes' ? morandiColors.darkAccent : morandiColors.text,
                backgroundColor: activeStockTab === 'quotes' ? morandiColors.mediumBg : 'transparent',
                position: 'relative',
                zIndex: 20
              }}
              onClick={() => setActiveStockTab('quotes')}
            >
              文字素材
            </button>
          </div>
          
          {/* 图片素材 */}
          {activeStockTab === 'images' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stockImages.map(image => (
                <div key={image.id} className="rounded-lg overflow-hidden shadow-sm" 
                  style={{ borderColor: morandiColors.mediumBg }}>
                  <img src={image.url} alt={image.alt} className="w-full h-28 object-cover" />
                  <div className="p-2 text-xs text-center" style={{ color: morandiColors.text }}>
                    {image.alt}
                  </div>
                  <button 
                    className="w-full py-2 text-amber-800 transition-all duration-200 hover:opacity-90 cursor-pointer"
                    style={{ background: gradients.accent, position: 'relative', zIndex: 20 }}
                    onClick={() => handleAddStockImage(image)}
                  >
                    添加
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* 文字素材 */}
          {activeStockTab === 'quotes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockQuotes.map(quote => (
                <div key={quote.id} className="rounded-lg p-4 shadow-sm" 
                  style={{ background: gradients.primary }}>
                  <p className="mb-3 text-center" style={{ color: morandiColors.text }}>{quote.text}</p>
                  <button 
                    className="w-full py-2 rounded-lg text-amber-800 transition-all duration-200 hover:opacity-90 cursor-pointer"
                    style={{ background: gradients.accent, position: 'relative', zIndex: 20 }}
                    onClick={() => handleAddStockQuote(quote)}
                  >
                    添加
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="p-6 text-center mt-6" style={{ background: gradients.header, color: morandiColors.darkAccent }}>
        <p>愿·景 &copy; 2025</p>
      </footer>

      {/* 模态框 - 选择模板 */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-xl shadow-lg" style={{ background: gradients.card }}>
            <h3 className="text-xl font-medium mb-6" style={{ color: morandiColors.text }}>选择模板</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {templates[activeTab]
                .filter(t => activeTab !== 'wallpaper' || t.type === deviceType)
                .map(template => (
                <div 
                  key={template.id} 
                  className={`rounded-xl p-4 cursor-pointer shadow-sm transition-all duration-200 hover:shadow-md`}
                  style={{ 
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: selectedTemplate?.id === template.id ? morandiColors.accent : morandiColors.mediumBg,
                    background: selectedTemplate?.id === template.id ? gradients.primary : 'white',
                    position: 'relative',
                    zIndex: 20
                  }}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="h-32 rounded-lg mb-3 flex items-center justify-center overflow-hidden shadow-sm"
                    style={{ background: morandiColors.lightBg }}>
                    {template.layout === '2x2' && (
                      <div className="grid grid-cols-2 gap-2 w-full h-full p-2">
                        <div className="rounded-md overflow-hidden shadow-sm" style={{ background: gradients.primary }}>
                          <div className="w-full h-full bg-cover bg-center" 
                            style={{ backgroundImage: `url('/api/placeholder/100/100')`, opacity: 0.7 }}></div>
                        </div>
                        <div className="rounded-md overflow-hidden shadow-sm" style={{ background: gradients.accent }}>
                          <div className="w-full h-full bg-cover bg-center" 
                            style={{ backgroundImage: `url('/api/placeholder/100/100')`, opacity: 0.7 }}></div>
                        </div>
                        <div className="rounded-md overflow-hidden shadow-sm" style={{ background: gradients.green }}>
                          <div className="w-full h-full bg-cover bg-center" 
                            style={{ backgroundImage: `url('/api/placeholder/100/100')`, opacity: 0.7 }}></div>
                        </div>
                        <div className="rounded-md overflow-hidden shadow-sm" style={{ background: gradients.button }}>
                          <div className="w-full h-full bg-cover bg-center" 
                            style={{ backgroundImage: `url('/api/placeholder/100/100')`, opacity: 0.7 }}></div>
                        </div>
                      </div>
                    )}
                    {template.layout === '3x3' && (
                      <div className="grid grid-cols-3 gap-1 w-full h-full p-2">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="rounded-md overflow-hidden shadow-sm" 
                            style={{ 
                              background: [
                                gradients.primary, 
                                gradients.accent, 
                                gradients.button, 
                                gradients.green, 
                                gradients.header, 
                                gradients.card,
                                gradients.primary, 
                                gradients.accent, 
                                gradients.button
                              ][i] 
                            }}>
                            <div className="w-full h-full bg-cover bg-center" 
                              style={{ backgroundImage: `url('/api/placeholder/50/50')`, opacity: 0.7 }}></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {template.layout === 'collage' && (
                      <div className="relative w-full h-full p-2">
                        <div className="absolute inset-0 rounded-lg" style={{ background: gradients.accent }}>
                          <div className="w-full h-full bg-cover bg-center" 
                            style={{ backgroundImage: `url('/api/placeholder/200/200')`, opacity: 0.5 }}></div>
                        </div>
                        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-lg shadow-md" 
                          style={{ background: gradients.primary }}>
                          <div className="w-full h-full bg-cover bg-center" 
                            style={{ backgroundImage: `url('/api/placeholder/100/100')`, opacity: 0.7 }}></div>
                        </div>
                        <div className="absolute right-2 bottom-2 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                          <div className="w-16 h-4 rounded" style={{ backgroundColor: morandiColors.darkAccent }}></div>
                        </div>
                      </div>
                    )}
                    {template.layout === 'simple' && (
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 rounded-lg" style={{ background: gradients.primary }}>
                          <div className="w-full h-full bg-cover bg-center" 
                            style={{ backgroundImage: `url('/api/placeholder/200/200')`, opacity: 0.5 }}></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2/3 h-1/3 rounded-lg p-2 flex items-center justify-center" 
                            style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                            <div className="w-4/5 h-3/4 rounded" style={{ backgroundColor: morandiColors.darkAccent }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {template.layout === 'centered' && (
                      <div className="relative w-full h-full" style={{ background: gradients.accent }}>
                        <div className="absolute inset-0 rounded-lg">
                          <div className="w-full h-full bg-cover bg-center" 
                            style={{ backgroundImage: `url('/api/placeholder/200/200')`, opacity: 0.5 }}></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2/3 p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                            <div className="w-full h-6 rounded mb-1" style={{ backgroundColor: morandiColors.darkAccent }}></div>
                            <div className="w-4/5 h-3 rounded" style={{ backgroundColor: morandiColors.darkAccent, opacity: 0.7 }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center font-medium" style={{ color: morandiColors.darkAccent }}>{template.name}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                className="px-5 py-2 rounded-lg mr-3 transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{ 
                  background: gradients.card,
                  color: morandiColors.darkAccent,
                  position: 'relative',
                  zIndex: 20
                }}
                onClick={() => setShowTemplateModal(false)}
              >
                取消
              </button>
              <button 
                className="px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{ 
                  background: gradients.button,
                  color: 'white',
                  position: 'relative',
                  zIndex: 20
                }}
                onClick={() => setShowTemplateModal(false)}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 模态框 - 添加图片 */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="rounded-xl p-8 w-full max-w-md shadow-lg" style={{ background: gradients.card }}>
            <h3 className="text-xl font-medium mb-6" style={{ color: morandiColors.text }}>添加图片</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: morandiColors.darkAccent }}>上传图片</label>
              <div className="border-2 border-dashed rounded-lg p-4" style={{ borderColor: morandiColors.secondary }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: morandiColors.darkAccent }}>在线图片URL</label>
              <input 
                type="text" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                style={{ borderColor: morandiColors.secondary }}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                className="px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{ 
                  background: gradients.card,
                  color: morandiColors.darkAccent,
                  position: 'relative',
                  zIndex: 20
                }}
                onClick={() => setShowImageModal(false)}
              >
                取消
              </button>
              <button 
                className="px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{ 
                  background: gradients.button,
                  color: 'white',
                  position: 'relative',
                  zIndex: 20
                }}
                onClick={handleAddImageUrl}
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 模态框 - 添加文字 */}
      {showTextModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="rounded-xl p-8 w-full max-w-md shadow-lg" style={{ background: gradients.card }}>
            <h3 className="text-xl font-medium mb-6" style={{ color: morandiColors.text }}>
              {editingTextId ? '编辑文字' : '添加文字'}
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: morandiColors.darkAccent }}>文字内容</label>
              <textarea 
                value={currentText.text}
                onChange={(e) => setCurrentText({...currentText, text: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg"
                style={{ borderColor: morandiColors.secondary }}
                rows="3"
                placeholder="输入你的愿景或肯定语"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: morandiColors.darkAccent }}>字体大小</label>
                <input 
                  type="number" 
                  value={currentText.fontSize}
                  onChange={(e) => setCurrentText({...currentText, fontSize: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border rounded-lg"
                  style={{ borderColor: morandiColors.secondary }}
                  min="10"
                  max="72"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: morandiColors.darkAccent }}>文字颜色</label>
                <input 
                  type="color" 
                  value={currentText.color}
                  onChange={(e) => setCurrentText({...currentText, color: e.target.value})}
                  className="w-full h-12 rounded-lg cursor-pointer"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: morandiColors.darkAccent }}>背景颜色</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={currentText.bgColor === 'transparent' ? '#ffffff' : currentText.bgColor}
                  onChange={(e) => setCurrentText({...currentText, bgColor: e.target.value})}
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <label className="flex items-center gap-2 cursor-pointer" style={{ color: morandiColors.text }}>
                  <input 
                    type="checkbox" 
                    checked={currentText.bgColor === 'transparent'}
                    onChange={(e) => setCurrentText({...currentText, bgColor: e.target.checked ? 'transparent' : '#ffffff'})}
                    className="w-4 h-4 cursor-pointer"
                  />
                  透明背景
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                className="px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{ 
                  background: gradients.card,
                  color: morandiColors.darkAccent,
                  position: 'relative',
                  zIndex: 20
                }}
                onClick={() => {
                  setShowTextModal(false);
                  setEditingTextId(null);
                  setCurrentText({ text: '', fontSize: 24, color: '#ffffff', bgColor: 'transparent', id: null });
                }}
              >
                取消
              </button>
              <button 
                className="px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{ 
                  background: gradients.button,
                  color: 'white',
                  position: 'relative',
                  zIndex: 20
                }}
                onClick={handleAddText}
              >
                {editingTextId ? '更新' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 根据当前页面渲染内容
  return activePage === 'home' ? renderHomePage() : renderEditorPage();
};

export default VisionBoardCreator;
