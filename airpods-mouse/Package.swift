// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "PodMouse",
    platforms: [.macOS(.v14)],
    targets: [
        // Pure math: calibration, filtering, gesture detection. No Apple frameworks,
        // so it is unit-tested on its own.
        .target(name: "PodMouseCore"),
        // The menu bar app: reads AirPods motion, drives the pointer.
        .executableTarget(name: "PodMouse", dependencies: ["PodMouseCore"]),
        .testTarget(name: "PodMouseCoreTests", dependencies: ["PodMouseCore"]),
    ]
)
