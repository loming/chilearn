import React from 'react';
import styles from './Layout.module.scss';
import { Cloud, Sun } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.sky}>
                <div className={styles.sun}>
                    <Sun size={80} color="#FFD60A" fill="#FFD60A" />
                </div>
                <div className={`${styles.cloud} ${styles.cloud1}`}>
                    <Cloud size={100} color="white" fill="white" />
                </div>
                <div className={`${styles.cloud} ${styles.cloud2}`}>
                    <Cloud size={80} color="white" fill="white" />
                </div>
                <div className={`${styles.cloud} ${styles.cloud3}`}>
                    <Cloud size={120} color="white" fill="white" />
                </div>
            </div>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
};
