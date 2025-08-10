import {Redirect, Slot} from "expo-router";
import React from "react";
import useAuthStore from "@/store/auth.store";

export default function TabLayout() {
    const {isAuthenticated} = useAuthStore();

    if (!isAuthenticated) return <Redirect href={"/(auth)/sign-in"}/>;

    return <Slot/>;
}
