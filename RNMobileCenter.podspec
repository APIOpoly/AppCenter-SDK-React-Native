Pod::Spec.new do |s|
  s.name              = 'RNMobileCenter'
  s.version           = '0.1.0'
  s.summary           = 'React Native plugin for Mobile Center'
  s.license           = 'MIT'
  s.homepage          = 'https://mobile.azure.com/'
  s.documentation_url = "https://docs.mobile.azure.com/"

  s.author           = { 'Microsoft' => 'mobilecentersdk@microsoft.com' }

  s.source = { :git => 'https://github.com/Microsoft/MobileCenter-SDK-React-Native.git' }

  s.platform          = :ios, '8.0'
  s.requires_arc      = true

  s.vendored_frameworks = 'RNMobileCenter/Products/RNMobileCenter/RNMobileCenter.framework'

  s.dependency 'MobileCenter', '~> 0.2.0'
end