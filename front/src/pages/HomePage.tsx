import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiUsers, FiCalendar, FiBarChart2, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDemo, setActiveDemo] = useState(1);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Effet pour détecter le défilement
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Cycle automatique des démos
    useEffect(() => {
        demoIntervalRef.current = setInterval(() => {
            setActiveDemo((prev) => (prev % 3) + 1);
        }, 5000);

        return () => {
            if (demoIntervalRef.current) {
                clearInterval(demoIntervalRef.current);
            }
        };
    }, []);

    // Arrêter le cycle automatique quand l'utilisateur interagit avec les démos
    const handleDemoChange = (demoIndex: number) => {
        if (demoIntervalRef.current) {
            clearInterval(demoIntervalRef.current);
        }
        setActiveDemo(demoIndex);
    };

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6 },
        },
    };

    // Fermer le menu mobile quand on clique sur un lien
    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50">
            {/* Navbar - Fixe au défilement */}
            <header
                className={`fixed w-full transition-all duration-300 z-50 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">A</span>
                        </div>
                        <span className="font-bold text-xl text-gray-800">AProjectO</span>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Fonctionnalités
                        </a>
                        <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Témoignages
                        </a>
                        <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Tarifs
                        </a>
                        <Link
                            to="/login"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Connexion
                        </Link>
                        <Link
                            to="/register"
                            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
                        >
                            Essayer gratuitement
                        </Link>
                    </nav>

                    {/* Menu mobile toggle */}
                    <button
                        className="md:hidden text-gray-700 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <FiX className="h-6 w-6" />
                        ) : (
                            <FiMenu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="md:hidden bg-white shadow-lg"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
                                <a
                                    href="#features"
                                    className="text-gray-600 py-2 hover:text-blue-600 transition-colors"
                                    onClick={handleNavLinkClick}
                                >
                                    Fonctionnalités
                                </a>
                                <a
                                    href="#testimonials"
                                    className="text-gray-600 py-2 hover:text-blue-600 transition-colors"
                                    onClick={handleNavLinkClick}
                                >
                                    Témoignages
                                </a>
                                <a
                                    href="#pricing"
                                    className="text-gray-600 py-2 hover:text-blue-600 transition-colors"
                                    onClick={handleNavLinkClick}
                                >
                                    Tarifs
                                </a>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 py-2 font-medium transition-colors"
                                    onClick={handleNavLinkClick}
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white py-2 px-5 rounded-full hover:bg-blue-700 transition-colors font-medium text-center"
                                    onClick={handleNavLinkClick}
                                >
                                    Essayer gratuitement
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <motion.section
                className="pt-32 pb-20 px-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="container mx-auto flex flex-col lg:flex-row items-center">
                    {/* Hero Text */}
                    <motion.div className="lg:w-1/2 mb-12 lg:mb-0" variants={itemVariants}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Gérez vos projets <br />
                            <span className="text-blue-600 relative inline-block">
                                simplement et efficacement
                                <span className="absolute -bottom-1 left-0 right-0 h-2 bg-blue-200 opacity-50 rounded-full"></span>
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 max-w-lg">
                            AProjectO vous permet de suivre vos projets, gérer vos tâches et collaborer avec votre équipe en toute simplicité.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold text-center transform hover:translate-y-[-2px] shadow-md hover:shadow-lg"
                            >
                                Commencer gratuitement
                            </Link>
                            <a
                                href="#demo"
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center"
                            >
                                Voir la démo
                                <FiArrowRight className="ml-2" />
                            </a>
                        </div>
                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <p className="text-gray-500 flex items-center">
                                <FiCheck className="text-green-500 mr-2" />
                                Aucune carte de crédit requise
                            </p>
                            <p className="text-gray-500 flex items-center">
                                <FiCheck className="text-green-500 mr-2" />
                                14 jours d'essai
                            </p>
                        </div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div className="lg:w-1/2" variants={itemVariants}>
                        <div className="relative bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl">
                            <img
                                src={"public/images/hero-mockup.jpeg"}
                                alt="AProjectO Dashboard"
                                className="rounded-lg relative z-10 w-full max-w-lg mx-auto"
                                style={{
                                    objectFit: 'contain',
                                    maxHeight: '400px'
                                }}
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/600x400?text=AProjectO+Dashboard';
                                }}
                            />

                            {/* Éléments décoratifs */}
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-100 opacity-5 rounded-2xl"></div>
                            <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-blue-200 rounded-2xl z-0"></div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Marquee des logos clients */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <p className="text-center text-gray-500 mb-8">Utilisé par des milliers d'équipes dans le monde</p>
                    <div className="flex justify-around items-center flex-wrap gap-8">
                        {['Google', 'Microsoft', 'Airbnb', 'Shopify', 'Slack'].map((company) => (
                            <div key={company} className="text-gray-400 font-semibold text-xl opacity-70 hover:opacity-100 transition-opacity">
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative inline-block">
                            Toutes les fonctionnalités dont vous avez besoin
                            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-400 rounded-full"></span>
                        </h2>
                        <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
                            Découvrez comment AProjectO peut vous aider à rationaliser votre flux de travail et à améliorer la productivité de votre équipe.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            whileHover={{ y: -5 }}
                        >
                            <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <FiUsers className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Collaboration d'équipe</h3>
                            <p className="text-gray-600">
                                Travaillez ensemble efficacement avec des outils de collaboration en temps réel et des tableaux kanban intuitifs.
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            whileHover={{ y: -5 }}
                        >
                            <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <FiCalendar className="h-7 w-7 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Planification de projet</h3>
                            <p className="text-gray-600">
                                Planifiez et suivez facilement vos projets avec des calendriers intégrés et des échéanciers personnalisables.
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            whileHover={{ y: -5 }}
                        >
                            <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                                <FiBarChart2 className="h-7 w-7 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Analyses et rapports</h3>
                            <p className="text-gray-600">
                                Obtenez des informations précieuses grâce à des tableaux de bord analytiques et des rapports détaillés.
                            </p>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            whileHover={{ y: -5 }}
                        >
                            <div className="h-14 w-14 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-7 w-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Gestion des tâches</h3>
                            <p className="text-gray-600">
                                Créez, attribuez et suivez les tâches avec notre système de glisser-déposer facile à utiliser.
                            </p>
                        </motion.div>

                        {/* Feature 5 */}
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            whileHover={{ y: -5 }}
                        >
                            <div className="h-14 w-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Sécurité avancée</h3>
                            <p className="text-gray-600">
                                Protégez vos données avec notre sécurité de niveau entreprise et nos contrôles d'accès granulaires.
                            </p>
                        </motion.div>

                        {/* Feature 6 */}
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            whileHover={{ y: -5 }}
                        >
                            <div className="h-14 w-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Notifications intelligentes</h3>
                            <p className="text-gray-600">
                                Restez informé avec des notifications personnalisables et des rappels de tâches importants.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-20 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative inline-block">
                            Voyez AProjectO en action
                            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-400 rounded-full"></span>
                        </h2>
                        <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
                            Découvrez comment notre plateforme transforme la gestion de projet
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {/* Tabs */}
                        <div className="flex justify-center space-x-4 mb-8 flex-wrap gap-y-2">
                            <button
                                className={`px-5 py-2 rounded-full transition-all ${activeDemo === 1
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                onClick={() => handleDemoChange(1)}
                            >
                                Tableau Kanban
                            </button>
                            <button
                                className={`px-5 py-2 rounded-full transition-all ${activeDemo === 2
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                onClick={() => handleDemoChange(2)}
                            >
                                Liste des tâches
                            </button>
                            <button
                                className={`px-5 py-2 rounded-full transition-all ${activeDemo === 3
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                onClick={() => handleDemoChange(3)}
                            >
                                Tableau de bord
                            </button>
                        </div>

                        {/* Demo Content */}
                        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl relative">
                            {/* Progress bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    key={activeDemo}
                                    transition={{ duration: 5, ease: "linear" }}
                                />
                            </div>

                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeDemo}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >

                                        {activeDemo === 1 && (
                                            <img
                                                src={"public/images/demo-kanban.png"}
                                                alt="Tableau Kanban"
                                                className="w-full"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/800x500?text=Tableau+Kanban';
                                                }}
                                            />
                                        )}
                                        {activeDemo === 2 && (
                                            <img
                                                src={"public/images/demo-tasks.png"}
                                                alt="Liste des tâches"
                                                className="w-full"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/800x500?text=Liste+des+tâches';
                                                }}
                                            />
                                        )}
                                        {activeDemo === 3 && (
                                            <img
                                                src={"public/images/demo-dashboard.png"}
                                                alt="Tableau de bord"
                                                className="w-full"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/800x500?text=Tableau+de+bord';
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 bg-blue-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative inline-block">
                            Ce que disent nos clients
                            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-400 rounded-full"></span>
                        </h2>
                        <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
                            Découvrez pourquoi des milliers d'équipes font confiance à AProjectO
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-md relative"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="text-blue-200 absolute top-4 right-6 opacity-50">
                                <svg width="40" height="40" fill="currentColor" viewBox="0 0 32 32">
                                    <path d="M10 8v12a2 2 0 002 2h8c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-6v-2c0-1.1.9-2 2-2h.5a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-.5c-2.2 0-4 1.8-4 4v2h-1a1 1 0 00-1 1zm12 4v8h-8v-8h8z" />
                                </svg>
                            </div>
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://randomuser.me/api/portraits/women/32.jpg"
                                    alt="Sophie Martin"
                                    className="w-12 h-12 rounded-full mr-4 border-2 border-blue-100"
                                />
                                <div>
                                    <h4 className="font-semibold">Sophie Martin</h4>
                                    <p className="text-gray-600 text-sm">Directrice de projet, TechSoft</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                "AProjectO a complètement transformé notre façon de gérer les projets. L'interface intuitive et les fonctionnalités puissantes nous ont permis d'améliorer notre productivité de 40%."
                            </p>
                            <div className="mt-4 flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </motion.div>

                        {/* Testimonial 2 */}
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-md relative"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="text-blue-200 absolute top-4 right-6 opacity-50">
                                <svg width="40" height="40" fill="currentColor" viewBox="0 0 32 32">
                                    <path d="M10 8v12a2 2 0 002 2h8c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-6v-2c0-1.1.9-2 2-2h.5a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-.5c-2.2 0-4 1.8-4 4v2h-1a1 1 0 00-1 1zm12 4v8h-8v-8h8z" />
                                </svg>
                            </div>
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://randomuser.me/api/portraits/men/40.jpg"
                                    alt="Thomas Dubois"
                                    className="w-12 h-12 rounded-full mr-4 border-2 border-blue-100"
                                />
                                <div>
                                    <h4 className="font-semibold">Thomas Dubois</h4>
                                    <p className="text-gray-600 text-sm">PDG, InnoStart</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                "En tant que startup en pleine croissance, nous avions besoin d'un outil flexible qui puisse évoluer avec nous. AProjectO a dépassé toutes nos attentes et est devenu indispensable pour notre équipe."
                            </p>
                            <div className="mt-4 flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </motion.div>

                        {/* Testimonial 3 */}
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-md relative"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="text-blue-200 absolute top-4 right-6 opacity-50">
                                <svg width="40" height="40" fill="currentColor" viewBox="0 0 32 32">
                                    <path d="M10 8v12a2 2 0 002 2h8c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-6v-2c0-1.1.9-2 2-2h.5a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-.5c-2.2 0-4 1.8-4 4v2h-1a1 1 0 00-1 1zm12 4v8h-8v-8h8z" />
                                </svg>
                            </div>
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://randomuser.me/api/portraits/women/68.jpg"
                                    alt="Camille Leclerc"
                                    className="w-12 h-12 rounded-full mr-4 border-2 border-blue-100"
                                />
                                <div>
                                    <h4 className="font-semibold">Camille Leclerc</h4>
                                    <p className="text-gray-600 text-sm">Chef d'équipe, DigitalForce</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                "La vue Kanban d'AProjectO est la meilleure que j'ai utilisée. Elle nous permet de voir exactement où en sont nos projets et ce qui doit être fait ensuite. C'est un changement radical pour notre équipe."
                            </p>
                            <div className="mt-4 flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative inline-block">
                            Des tarifs simples et transparents
                            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-400 rounded-full"></span>
                        </h2>
                        <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
                            Choisissez le plan qui correspond le mieux aux besoins de votre équipe
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Plan Démarrage */}
                        <motion.div
                            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all p-8"
                            whileHover={{ y: -10 }}
                        >
                            <h3 className="text-xl font-semibold mb-2">Démarrage</h3>
                            <p className="text-gray-600 mb-6">Parfait pour les petites équipes</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">€0</span>
                                <span className="text-gray-600">/mois</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center">
                                    <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                                    <span>Jusqu'à 5 utilisateurs</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                                    <span>3 projets</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                                    <span>Tableau Kanban basique</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                                    <span>Gestion des tâches</span>
                                </li>
                            </ul>
                            <Link
                                to="/register"
                                className="block text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                            >
                                Commencer gratuitement
                            </Link>
                        </motion.div>

                        {/* Plan Pro */}
                        <motion.div
                            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 transform md:-translate-y-4 relative"
                            whileHover={{ y: -14 }}
                        >
                            <div className="absolute top-0 right-6 -translate-y-1/2 bg-yellow-400 text-xs font-bold uppercase py-1 px-3 rounded-full text-yellow-900 shadow-md">
                                Populaire
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Pro</h3>
                            <p className="text-blue-200 mb-6">Idéal pour les équipes en croissance</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">€12</span>
                                <span className="text-blue-200">/utilisateur/mois</span>
                            </div>
                            <ul className="space-y-3 mb-8 text-white">
                                <li className="flex items-center">
                                    <FiCheck className="text-green-300 mr-2 flex-shrink-0" />
                                    <span>Utilisateurs illimités</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-300 mr-2 flex-shrink-0" />
                                    <span>Projets illimités</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-300 mr-2 flex-shrink-0" />
                                    <span>Tableaux Kanban avancés</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-300 mr-2 flex-shrink-0" />
                                    <span>Rapports et analyses</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-300 mr-2 flex-shrink-0" />
                                    <span>Intégrations avancées</span>
                                </li>
                            </ul>
                            <Link
                                to="/register"
                                className="block text-center py-2 px-4 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors shadow-md"
                            >
                                Essayer 14 jours gratuits
                            </Link>
                        </motion.div>

                        {/* Plan Entreprise */}
                        <motion.div
                            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all p-8"
                            whileHover={{ y: -10 }}
                        >
                            <h3 className="text-xl font-semibold mb-2">Entreprise</h3>
                            <p className="text-gray-600 mb-6">Pour les grandes organisations</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">€25</span>
                                <span className="text-gray-600">/utilisateur/mois</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center">
                                    <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                                    <span>Tout dans Pro, plus :</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                                    <span>Sécurité de niveau entreprise</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                                    <span>Support dédié 24/7</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                                    <span>Contrôles d'administration avancés</span>
                                </li>
                                <li className="flex items-center">
                                    <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                                    <span>Personnalisation complète</span>
                                </li>
                            </ul>
                            <Link
                                to="/register"
                                className="block text-center py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
                            >
                                Contacter les ventes
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden relative">
                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
                    <div className="absolute top-20 right-10 w-20 h-20 bg-white rounded-full"></div>
                    <div className="absolute bottom-10 left-1/4 w-30 h-30 bg-white rounded-full"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Prêt à transformer votre gestion de projet ?
                    </motion.h2>
                    <motion.p
                        className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Rejoignez des milliers d'équipes qui utilisent AProjectO pour réussir leurs projets.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-white text-blue-700 rounded-full hover:bg-blue-50 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
                        >
                            Commencer gratuitement
                        </Link>
                        <a
                            href="#demo"
                            className="px-8 py-3 border border-white text-white rounded-full hover:bg-blue-700 transition-colors font-semibold"
                        >
                            En savoir plus
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white font-semibold mb-4">Produit</h3>
                            <ul className="space-y-2">
                                <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Tarifs</a></li>
                                <li><a href="#testimonials" className="hover:text-white transition-colors">Témoignages</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Ressources</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Webinaires</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Entreprise</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Légal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">RGPD</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                                <span className="text-white text-lg font-bold">A</span>
                            </div>
                            <span className="font-bold text-xl text-white">AProjectO</span>
                        </div>
                        <p className="text-sm">© {new Date().getFullYear()} AProjectO. Tous droits réservés.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;