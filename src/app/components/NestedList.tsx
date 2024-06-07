"use client";

import React, {useState} from 'react';

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
    onAddChild: (indexes: number[]) => void;
    onEdit: (newName: string, indexes: number[]) => void;
    indexes: number[];
    currentLevel: number;
}

const Item: React.FC<ItemProps> = ({item, onAddChild, onEdit, indexes, currentLevel}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(item.name);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onEdit(newName, indexes);
        setIsEditing(false);
    };

    return (
        <div className="ml-5 p-2 border border-gray-300 rounded mb-2 bg-gray-100 hover:bg-gray-200">
            {isEditing ? (
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                    }}
                    className="p-1 text-sm"
                />
            ) : (
                <span onClick={handleEdit}>{item.name}</span>
            )}
            {currentLevel < 3 && (
                <button className="ml-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={() => onAddChild(indexes)}>
                    Add Child
                </button>
            )}
            {item.children.map((child, index) => (
                <Item
                    key={index}
                    item={child}
                    onAddChild={onAddChild}
                    onEdit={onEdit}
                    indexes={[...indexes, index]}
                    currentLevel={currentLevel + 1}
                />
            ))}
        </div>
    );
};

const NestedList: React.FC = () => {
    const [data, setData] = useState<ItemType[]>(initialData);

    const handleAddItem = () => {
        setData([...data, {name: 'New Item', children: []}]);
    };

    const handleAddChild = (indexes: number[]) => {
        const newData = [...data];
        let currentLevel = newData;

        indexes.forEach((index, idx) => {
            if (idx === indexes.length - 1) {
                currentLevel[index].children.push({name: 'New Child', children: []});
            } else {
                currentLevel = currentLevel[index].children;
            }
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
                    onAddChild={handleAddChild}
                    onEdit={handleEdit}
                    indexes={currentIndexes}
                    currentLevel={currentLevel}
                />
            );
        });
    };

    return (
        <div className="flex justify-center mt-20 w-full">
            <div className="max-w-screen-md w-full p-5">
                <div className="text-2xl mb-5 text-center">Nested List Example</div>
                <button className="mb-5 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
                        onClick={handleAddItem}>
                    Add Top-Level Item
                </button>
                {renderItems(data)}
            </div>
        </div>
    );
};

export default NestedList;
