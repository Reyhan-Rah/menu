"use client";

import React, { useState } from 'react';
import styles from './NestedList.module.css';

interface ItemType {
    name: string;
    children: ItemType[];
}

const initialData: ItemType[] = [
    {
        name: "Item 1",
        children: []
    },
    {
        name: "Item 2",
        children: []
    }
];

interface ItemProps {
    item: ItemType;
    onAddChild: () => void;
    onEdit: (newName: string) => void;
    currentLevel: number;
}

const Item: React.FC<ItemProps> = ({ item, onAddChild, onEdit, currentLevel }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(item.name);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onEdit(newName);
        setIsEditing(false);
    };

    return (
        <div className={styles.item}>
            {isEditing ? (
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                    }}
                    className={styles.input}
                />
            ) : (
                <span onClick={handleEdit}>{item.name}</span>
            )}
            {currentLevel < 3 && <button className={styles.button} onClick={onAddChild}>Add Child</button>}
            {item.children.map((child, index) => (
                <Item
                    key={index}
                    item={child}
                    onAddChild={() => onAddChild(index)}
                    onEdit={(newName) => onEdit(newName, index)}
                    currentLevel={currentLevel + 1}
                />
            ))}
        </div>
    );
};

const NestedList: React.FC = () => {
    const [data, setData] = useState<ItemType[]>(initialData);

    const handleAddItem = () => {
        setData([...data, { name: 'New Item', children: [] }]);
    };

    const handleAddChild = (indexes: number[]) => {
        const newData = [...data];
        let currentLevel = newData;
        let depth = 0;

        indexes.forEach((index, idx) => {
            if (idx === indexes.length - 1) {
                if (depth < 2) {
                    currentLevel[index].children.push({ name: 'New Child', children: [] });
                }
            } else {
                currentLevel = currentLevel[index].children;
            }
            depth++;
        });

        setData(newData);
    };

    const handleEdit = (newName: string, indexes: number[]) => {
        const newData = [...data];
        let currentLevel = newData;

        indexes.forEach((index, idx) => {
            if (idx === indexes.length - 1) {
                currentLevel[index].name = newName;
            } else {
                currentLevel = currentLevel[index].children;
            }
        });

        setData(newData);
    };

    const renderItems = (items: ItemType[], indexes: number[] = [], currentLevel: number = 0) => {
        return items.map((item, index) => {
            const currentIndexes = [...indexes, index];
            return (
                <Item
                    key={index}
                    item={item}
                    onAddChild={() => handleAddChild(currentIndexes)}
                    onEdit={(newName: string) => handleEdit(newName, currentIndexes)}
                    currentLevel={currentLevel}
                />
            );
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>Nested List Example</div>
            <button className={styles.addButton} onClick={handleAddItem}>Add Top-Level Item</button>
            {renderItems(data)}
        </div>
    );
};

export default NestedList;
