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
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firsebase.js";
import {
  setOtherCosts,
  addOtherCost,
  removeOtherCost,
} from "../slices/otherCostsSlice";

const OtherCostsList = ({ userId }) => {
  const dispatch = useDispatch();
  const otherCosts = useSelector((state) => state.otherCosts.list);
  const toast = useToast();

  const [newCostName, setNewCostName] = useState("");
  const [newCostAmount, setNewCostAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    console.log("Setting up other costs listener for userId:", userId);

    const q = query(
      collection(db, "otherCosts"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(
          "Other costs snapshot received, docs count:",
          snapshot.docs.length
        );

        const costsData = snapshot.docs.map((doc) => {
          const data = { id: doc.id, ...doc.data() };
          console.log("Other cost data:", data);
          return data;
        });

        console.log("All other costs data:", costsData);
        dispatch(setOtherCosts(costsData));
      },
      (error) => {
        console.error("Error fetching other costs:", error);
        toast({
          title: "Error fetching other costs",
          description: error.message,
          status: "error",
          duration: 3000,
        });
      }
    );

    return () => unsubscribe();
  }, [userId, dispatch, toast]);

  const handleAddCost = async () => {
    if (!newCostName.trim() || !newCostAmount) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      const costData = {
        name: newCostName.trim(),
        amount: parseFloat(newCostAmount),
        userId: userId,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "otherCosts"), costData);

      setNewCostName("");
      setNewCostAmount("");

      toast({
        title: "Cost added successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error adding cost:", error);
      toast({
        title: "Error adding cost",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCost = async (costId) => {
    try {
      await deleteDoc(doc(db, "otherCosts", costId));
      toast({
        title: "Cost deleted successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error deleting cost:", error);
      toast({
        title: "Error deleting cost",
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
          placeholder="Cost name"
          value={newCostName}
          onChange={(e) => setNewCostName(e.target.value)}
          size="sm"
        />
        <Input
          placeholder="Amount"
          type="number"
          value={newCostAmount}
          onChange={(e) => setNewCostAmount(e.target.value)}
          size="sm"
          w="100px"
        />
        <IconButton
          icon={<AddIcon />}
          onClick={handleAddCost}
          isLoading={loading}
          colorScheme="green"
          size="sm"
        />
      </HStack>

      <VStack spacing={2} align="stretch">
        {otherCosts?.length > 0 ? (
          otherCosts.map((cost) => (
            <HStack
              key={cost.id}
              p={2}
              bg="white"
              borderRadius="md"
              borderWidth={1}
              justify="space-between"
            >
              <Text>{cost.name}</Text>
              <HStack>
                <Text fontWeight="bold">
                  ${cost.amount?.toFixed(2) || "0.00"}
                </Text>
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleDeleteCost(cost.id)}
                />
              </HStack>
            </HStack>
          ))
        ) : (
          <Text color="gray.500" textAlign="center">
            No other costs found. Add some costs above.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default OtherCostsList;
