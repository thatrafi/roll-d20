import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Rect, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSpring, cancelAnimation } from 'react-native-reanimated';
import { COLORS } from '../theme';

interface DiceProps {
    type: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
    value: number;
    size?: number;
    color?: string;
    rolling?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const Dice: React.FC<DiceProps> = ({ type, value, size = 100, color = COLORS.primary, rolling = false }) => {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        if (rolling) {
            rotation.value = withRepeat(
                withTiming(360, { duration: 500, easing: Easing.linear }),
                -1,
                false
            );
            scale.value = withRepeat(
                withTiming(1.1, { duration: 250, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        } else {
            cancelAnimation(rotation);
            cancelAnimation(scale);
            rotation.value = 0;
            scale.value = withSpring(1);
        }
    }, [rolling]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${rotation.value}deg` },
                { scale: scale.value }
            ],
        };
    });

    const renderShape = () => {
        const commonProps = {
            fill: "url(#grad)",
            stroke: "rgba(255,255,255,0.2)",
            strokeWidth: "2"
        };

        const shadowProps = {
            fill: "rgba(0,0,0,0.5)",
            transform: "translate(2, 4)"
        };

        switch (type) {
            case 'd4':
                // Triangle
                const d4Points = "50,10 90,85 10,85";
                return (
                    <>
                        <Polygon points={d4Points} {...shadowProps} />
                        <Polygon points={d4Points} {...commonProps} />
                    </>
                );
            case 'd6':
                // Rounded Square
                return (
                    <>
                        <Rect x="12" y="14" width="76" height="76" rx="12" {...shadowProps} />
                        <Rect x="10" y="10" width="80" height="80" rx="12" {...commonProps} />
                    </>
                );
            case 'd8':
                // Diamond
                const d8Points = "50,5 90,50 50,95 10,50";
                return (
                    <>
                         <Polygon points={d8Points} {...shadowProps} />
                         <Polygon points={d8Points} {...commonProps} />
                         {/* Internal lines for 3D effect */}
                         <Polygon points="50,5 50,95" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                         <Polygon points="10,50 90,50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    </>
                );
            case 'd10':
                // Kite
                const d10Points = "50,5 85,35 50,95 15,35";
                return (
                    <>
                         <Polygon points={d10Points} {...shadowProps} />
                         <Polygon points={d10Points} {...commonProps} />
                         <Polygon points="50,5 50,95" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                         <Polygon points="15,35 85,35" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    </>
                );
            case 'd12':
                // Pentagon
                const d12Points = "50,5 93,36 76,86 24,86 7,36";
                return (
                    <>
                        <Polygon points={d12Points} {...shadowProps} />
                        <Polygon points={d12Points} {...commonProps} />
                    </>
                );
            case 'd20':
                 // Hexagon
                const d20Points = "50,5 89,27 89,73 50,95 11,73 11,27";
                return (
                    <>
                         <Polygon points={d20Points} {...shadowProps} />
                         <Polygon points={d20Points} {...commonProps} />
                    </>
                );
            case 'd100':
                // Circle
                return (
                    <>
                        <Circle cx="52" cy="54" r="42" {...shadowProps} />
                        <Circle cx="50" cy="50" r="45" {...commonProps} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatedView style={[styles.container, { width: size, height: size }, animatedStyle]}>
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor={color} stopOpacity="1" />
                        <Stop offset="1" stopColor="#1a1a1a" stopOpacity="0.8" />
                    </LinearGradient>
                </Defs>
                {renderShape()}
            </Svg>
            <View style={styles.textContainer}>
                <Text style={[
                    styles.text,
                    {
                        fontSize: type === 'd100' ? size * 0.25 : size * 0.35,
                        color: 'rgba(255,255,255,0.9)',
                        textShadowColor: 'rgba(0,0,0,0.5)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2
                    }
                ]}>
                    {rolling ? '...' : value}
                </Text>
            </View>
        </AnimatedView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: 'bold',
    }
});

export default Dice;
