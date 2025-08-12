import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';
import {Button} from 'react-native';
import {logOutUser} from '@/lib/appwrite';
import {router} from 'expo-router';
import CustomButton from "@/components/CustomButton";

const Profile = () => {
    const handleLogout = async () => {
        try {
            await logOutUser();
            router.replace('/(auth)/sign-in');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <SafeAreaView className="bg-white h-full pb-28 px-5 pt-5">
            <CustomHeader title="Profile"/>
            <CustomButton title="Logout" onPress={handleLogout}/>
        </SafeAreaView>
    );
};

export default Profile;