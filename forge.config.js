module.exports = {  
  packagerConfig: {
    asar: true,
    icon: '/public/images/icon.png' 
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: '/public/images/icon.png'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: '/public/images/icon.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: '/public/images/icon.png'
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
