import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  VStack,
  Text,
  Button,
  Input,
  HStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firsebase.js";
import {
  setItems,
  addItem,
  removeItem,
  updateItem,
} from "../slices/itemsSlice";

const ItemsList = ({ userId }) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.list);
  const toast = useToast();

  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedAmount, setEditedAmount] = useState("");

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "items"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const itemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setItems(itemsData));
      },
      (error) => {
        toast({
          title: "Error fetching items",
          description: error.message,
          status: "error",
          duration: 3000,
        });
      }
    );

    return () => unsubscribe();
  }, [userId, dispatch, toast]);

  const handleAddItem = async () => {
    if (!newItemName.trim() || !newItemAmount) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        name: newItemName.trim(),
        amount: parseFloat(newItemAmount),
        userId,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "items"), itemData);

      setNewItemName("");
      setNewItemAmount("");
      toast({
        title: "Item added successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error adding item",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "items", itemId));
      toast({
        title: "Item deleted successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error deleting item",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditedName(item.name);
    setEditedAmount(item.amount);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedName("");
    setEditedAmount("");
  };

  const handleUpdateItem = async (item) => {
    try {
      const updatedItem = {
        ...item,
        name: editedName,
        amount: parseFloat(editedAmount),
      };

      await updateDoc(doc(db, "items", item.id), updatedItem);
      dispatch(updateItem(updatedItem));
      setEditingId(null);

      toast({
        title: "Item updated successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error updating item",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <HStack mb={4} spacing={2}>
        <Input
          placeholder="Item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          size="sm"
        />
        <Input
          placeholder="Amount"
          type="number"
          value={newItemAmount}
          onChange={(e) => setNewItemAmount(e.target.value)}
          size="sm"
          w="100px"
        />
        <IconButton
          icon={<AddIcon />}
          onClick={handleAddItem}
          isLoading={loading}
          colorScheme="green"
          size="sm"
        />
      </HStack>

      <VStack spacing={2} align="stretch">
        {items?.length > 0 ? (
          items.map((item) => (
            <HStack
              key={item.id}
              p={2}
              bg="white"
              borderRadius="md"
              borderWidth={1}
              justify="space-between"
            >
              {editingId === item.id ? (
                <>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    size="sm"
                    w="40%"
                  />
                  <Input
                    value={editedAmount}
                    onChange={(e) => setEditedAmount(e.target.value)}
                    size="sm"
                    w="80px"
                    type="number"
                  />
                  <HStack>
                    <IconButton
                      icon={<CheckIcon />}
                      onClick={() => handleUpdateItem(item)}
                      size="sm"
                      colorScheme="blue"
                    />
                    <IconButton
                      icon={<CloseIcon />}
                      onClick={handleCancelEdit}
                      size="sm"
                      colorScheme="gray"
                    />
                  </HStack>
                </>
              ) : (
                <>
                  <Text>{item.name}</Text>
                  <HStack>
                    <Text fontWeight="bold">
                      ${item.amount?.toFixed(2) || "0.00"}
                    </Text>
                    <IconButton
                      icon={<EditIcon />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => handleEditClick(item)}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDeleteItem(item.id)}
                    />
                  </HStack>
                </>
              )}
            </HStack>
          ))
        ) : (
          <Text color="gray.500" textAlign="center">
            No items found. Add some items above.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default ItemsList;
