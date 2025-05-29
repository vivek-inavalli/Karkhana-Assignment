import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { Box, Button, Heading, VStack, Text } from "@chakra-ui/react";
import ItemsList from "../components/ItemsList";
import OtherCostsList from "../components/OtherCostsList";
import { auth } from "../firsebase.js";
import { signOut } from "firebase/auth";
import { clearUser } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const items = useSelector((state) => state.items.list);
  const otherCosts = useSelector((state) => state.otherCosts.list);

  const [showTotal, setShowTotal] = useState(false);

  const fullState = useSelector((state) => state);
  console.log("Full Redux state:", fullState);

  const totalCost = useMemo(() => {
    console.log("Calculating total cost...");
    console.log("Items from Redux:", items);
    console.log("OtherCosts from Redux:", otherCosts);

    const itemsTotal =
      items?.reduce((acc, item) => {
        console.log("Processing item:", item);
        const amount = parseFloat(item.amount || 0);
        console.log("Item amount:", amount);
        return acc + (isNaN(amount) ? 0 : amount);
      }, 0) || 0;

    const otherCostsTotal =
      otherCosts?.reduce((acc, cost) => {
        console.log("Processing other cost:", cost);
        const amount = parseFloat(cost.amount || 0);
        console.log("Other cost amount:", amount);
        return acc + (isNaN(amount) ? 0 : amount);
      }, 0) || 0;

    console.log("Items total:", itemsTotal);
    console.log("Other costs total:", otherCostsTotal);
    const total = itemsTotal + otherCostsTotal;
    console.log("Final total:", total);

    return total;
  }, [items, otherCosts]);

  useEffect(() => {
    if (items?.length > 0 || otherCosts?.length > 0) {
      setShowTotal(true);
    }
  }, [items, otherCosts]);

  if (!user) return <Heading>Please log in</Heading>;

  const handleCalculateTotal = () => {
    setShowTotal(true);
    console.log("Items:", items);
    console.log("Other Costs:", otherCosts);
    console.log("Total Cost:", totalCost);
  };

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    navigate("/auth");
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Dashboard</Heading>

      <Button colorScheme="red" onClick={handleLogout} mb={6}>
        Logout
      </Button>

      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md">Items</Heading>
          <ItemsList userId={user.uid} />
        </Box>

        <Box>
          <Heading size="md">Other Costs</Heading>
          <OtherCostsList userId={user.uid} />
        </Box>

        <Button
          colorScheme="blue"
          onClick={handleCalculateTotal}
          mt={4}
          w="200px"
        >
          Calculate Total Cost
        </Button>

        {(showTotal || totalCost > 0) && (
          <Box mt={4} p={4} bg="gray.100" borderRadius="md">
            <Text fontWeight="bold">Total Cost:</Text>
            <Text fontSize="xl">${totalCost.toFixed(2)}</Text>

            <Box mt={2} fontSize="sm" color="gray.600">
              <Text>Items count: {items?.length || 0}</Text>
              <Text>Other costs count: {otherCosts?.length || 0}</Text>

              {items?.length > 0 && (
                <Text>
                  Items total: $
                  {items
                    .reduce((acc, item) => {
                      const amount = parseFloat(
                        item.amount ||
                          item.cost ||
                          item.price ||
                          item.value ||
                          item.total ||
                          0
                      );
                      return acc + (isNaN(amount) ? 0 : amount);
                    }, 0)
                    .toFixed(2)}
                </Text>
              )}

              {otherCosts?.length > 0 && (
                <Text>
                  Other costs total: $
                  {otherCosts
                    .reduce((acc, cost) => {
                      const amount = parseFloat(
                        cost.amount ||
                          cost.cost ||
                          cost.price ||
                          cost.value ||
                          cost.total ||
                          0
                      );
                      return acc + (isNaN(amount) ? 0 : amount);
                    }, 0)
                    .toFixed(2)}
                </Text>
              )}

              {(!items || items.length === 0) &&
                (!otherCosts || otherCosts.length === 0) && (
                  <Text color="red.500">
                    No items or costs found in Redux state
                  </Text>
                )}
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Dashboard;
