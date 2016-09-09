Pod::Spec.new do |s|
  s.name             = "AvalancheHub"
  s.version          = "0.0.1"
  s.summary          = "Sonoma SDK Core"

  s.homepage         = "https://github.com/Microsoft/Sonoma-SDK-iOS"
  s.license          = 'MIT'
  s.author           = { "Microsoft Corporation" => "codepush@microsoft.com" }
  s.source           = { :git => "https://github.com/Microsoft/Sonoma-SDK-iOS.git" }

  s.platform     = :ios, '7.0'
  s.requires_arc = true
  s.vendored_frameworks = 'Sonoma-SDK-iOS/Products/AvalancheHub/AvalancheHub.framework'
end