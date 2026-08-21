import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function ProgressStepper({ currentStep = 0 }) {
    const steps = ['Enviado', 'Aceptado', 'En proceso', 'Finalizado'];

    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const isActive = index <= currentStep; // Si ya pasamos por aquí, se pinta
                const isLast = index === steps.length - 1;

                return (
                    <React.Fragment key={index}>
                        {/* El Punto y el Texto */}
                        <View style={styles.stepWrapper}>
                            <View style={[styles.dot, isActive && styles.dotActive]} />
                            <Text style={[styles.stepText, isActive && styles.textActive]}>
                                {step}
                            </Text>
                        </View>

                        {/* La Línea Conectora (excepto en el último paso) */}
                        {!isLast && (
                            <View style={[styles.line, isActive && styles.lineActive]} />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginVertical: 30,
        width: '100%',
    },
    stepWrapper: {
        alignItems: 'center',
        width: 65, // Fija un ancho para que los textos no empujen las líneas
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.border,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: colors.surface,
        elevation: 2, // Sombrita ligera
    },
    dotActive: {
        backgroundColor: colors.primary, // Verde DaNico
    },
    line: {
        flex: 1,
        height: 3,
        backgroundColor: colors.border,
        marginTop: 6, // Alineado con el centro del punto
        marginHorizontal: -15, // Solapa ligeramente con los wrappers
        zIndex: -1,
    },
    lineActive: {
        backgroundColor: colors.primary,
    },
    stepText: {
        fontSize: 10,
        color: colors.textMuted,
        textAlign: 'center',
        fontWeight: '500',
    },
    textActive: {
        color: colors.textMain,
        fontWeight: 'bold',
    },
});