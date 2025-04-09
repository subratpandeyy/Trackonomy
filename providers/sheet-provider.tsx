"use client";

import { useMountedState } from "react-use";    //also used for media-queries

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";

import { NewCategorytSheet } from "@/features/categories/components/new-category-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";

import { NewTransactioniSheet } from "@/features/transactions/components/new-transaction-sheet";
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";

export const SheetProvider = () => {
    const isMounted = useMountedState();    //same as useState()

    if(!isMounted) return null;

    return(
        <>
            <NewAccountSheet/>
            <EditAccountSheet />
            <NewCategorytSheet />
            <EditCategorySheet />
            <NewTransactioniSheet />
            <EditTransactionSheet />
        </>
    )
}