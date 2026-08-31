import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function ProgressStepper({ currentStep = 0 }) {
    const steps = ['Enviado', 'Aceptado', 'En proceso', 'Finalizado'];

    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isPending = index > currentStep;

                const isFirst = index === 0;
                const isLast = index === steps.length - 1;

                // Lógica de llenado de líneas (conecta paso completado con el actual)
                const isLeftLineActive = isCompleted || isActive;
                const isRightLineActive = isCompleted;

                return (
                    <View key={index} style={styles.stepContainer}>

                        {/* Línea Izquierda Absoluta */}
                        {!isFirst && (
                            <View style={[styles.line, styles.leftLine, isLeftLineActive && styles.lineActive]} />
                        )}

                        {/* Línea Derecha Absoluta */}
                        {!isLast && (
                            <View style={[styles.line, styles.rightLine, isRightLineActive && styles.lineActive]} />
                        )}

                        {/* Punto Central */}
                        <View style={[
                            styles.dot,
                            (isCompleted || isActive) && styles.dotActive,
                            isPending && styles.dotPending
                        ]}>
                            {isCompleted ? (
                                <Ionicons name="checkmark" size={14} color={colors.surface} />
                            ) : isActive ? (
                                <View style={styles.innerDot} />
                            ) : null}
                        </View>

                        {/* Texto */}
                        <Text style={[
                            styles.stepText,
                            isCompleted && styles.textCompleted,
                            isActive && styles.textActive,
                            isPending && styles.textPending
                        ]}>
                            {step}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: 25,
        width: '100%',
    },
    stepContainer: {
        flex: 1, // Reparte el espacio equitativamente a cada paso
        alignItems: 'center',
        position: 'relative', // Clave para que las líneas pasen por detrás
    },
    line: {
        position: 'absolute',
        top: 10.5, // Centrado perfecto con la altura de 24px del punto
        height: 3,
        backgroundColor: colors.border,
        zIndex: 0,
    },
    leftLine: {
        left: 0,
        right: '50%',
    },
    rightLine: {
        left: '50%',
        right: 0,
    },
    lineActive: {
        backgroundColor: colors.primary, // La línea se pinta del color de la marca
    },
    dot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        zIndex: 1, // Se coloca siempre por encima de las líneas
    },
    dotPending: {
        borderWidth: 2,
        borderColor: colors.border,
    },
    dotActive: {
        backgroundColor: colors.primary,
        borderWidth: 0,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    innerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.surface,
    },
    stepText: {
        fontSize: 11,
        marginTop: 10,
        textAlign: 'center',
    },
    textPending: {
        color: colors.textMuted,
        fontWeight: '500',
    },
    textActive: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    textCompleted: {
        color: colors.textMain,
        fontWeight: '600',
    },
});