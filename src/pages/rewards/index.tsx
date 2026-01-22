import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Coins, TrendingUp, PieChart, Award, Shield, Zap, Heart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { getUserTokenInfo } from "@/services/tokens";
import { getCommunityPotData, CommunityPotData } from "@/services/community-pot";
import { TokenTier, TOKEN_TIER_THRESHOLDS } from "@/types/database";

// Mock data for charts
const monthlyData = [
  { month: "Jan", savings: 2.15 },
  { month: "Feb", savings: 3.42 },
  { month: "Mar", savings: 4.87 },
  { month: "Apr", savings: 5.63 },
  { month: "May", savings: 7.21 },
  { month: "Jun", savings: 8.53 },
];

const TokenRewards = () => {
  const { session } = useAuth();
  const [userTokens, setUserTokens] = useState(0);
  const [userTier, setUserTier] = useState<TokenTier>("Bronze");
  const [communityPot, setCommunityPot] = useState<CommunityPotData | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate next tier and tokens needed
  const getNextTierInfo = (currentTier: TokenTier, currentTokens: number) => {
    const tiers: TokenTier[] = ["Bronze", "Silver", "Gold", "Platinum"];
    const currentIndex = tiers.indexOf(currentTier);
    if (currentIndex >= tiers.length - 1) {
      return { nextTier: null, tokensNeeded: 0 };
    }
    const nextTier = tiers[currentIndex + 1];
    const tokensNeeded = TOKEN_TIER_THRESHOLDS[nextTier] - currentTokens;
    return { nextTier, tokensNeeded };
  };

  const { nextTier, tokensNeeded } = getNextTierInfo(userTier, userTokens);

  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [potData] = await Promise.all([
          getCommunityPotData(),
        ]);
        setCommunityPot(potData);

        // Fetch user token info if signed in
        if (session?.uid) {
          const tokenInfo = await getUserTokenInfo(session.uid);
          setUserTokens(tokenInfo.balance);
          setUserTier(tokenInfo.tier);
        }
      } catch (error) {
        console.error("Error fetching rewards data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.uid]);

  const monthlySpending = 124.75;
  const monthlySavings = 8.53;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-green-800 mb-4">
            $FCUK Token Rewards
          </h1>
          <p className="text-green-700 max-w-3xl">
            Earn tokens with every purchase and interaction, then use them to
            unlock discounts and exclusive benefits across the platform.
          </p>
        </div>

        {/* User Token Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border border-green-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-800">
                Your Token Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Coins className="h-8 w-8 text-amber-500 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-green-800">
                    {userTokens} $FCUK
                  </p>
                  <p className="text-sm text-green-600">
                    Current Tier: {userTier}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-800">
                Monthly Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-green-800">
                    £{monthlySavings.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-600">
                    From £{monthlySpending.toFixed(2)} spent
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-800">
                Next Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Award className="h-8 w-8 text-amber-600 mr-3" />
                <div>
                  {nextTier ? (
                    <>
                      <p className="text-3xl font-bold text-green-800">{nextTier} Tier</p>
                      <p className="text-sm text-green-600">
                        {tokensNeeded} more tokens needed
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-green-800">Max Tier!</p>
                      <p className="text-sm text-green-600">
                        You've reached the top
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Pot Section */}
        {communityPot && (
          <div className="mb-12">
            <Card className="border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-100 rounded-full">
                      <Heart className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-rose-800">
                        The Community Pot
                      </CardTitle>
                      <CardDescription className="text-rose-600">
                        1% of every purchase supports local initiatives
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-rose-700">
                      £{communityPot.totalAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-rose-600">Total raised</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Current Initiative */}
                <div className="bg-white rounded-lg p-6 mb-6 border border-rose-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-rose-600" />
                    <h3 className="font-semibold text-rose-800">This Month's Initiative</h3>
                  </div>
                  <h4 className="text-xl font-medium text-gray-800 mb-2">
                    {communityPot.currentInitiative.name}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {communityPot.currentInitiative.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-rose-600">
                        £{communityPot.currentInitiative.raised.toFixed(2)} raised
                      </span>
                      <span className="text-gray-500">
                        Goal: £{communityPot.currentInitiative.goal.toFixed(2)}
                      </span>
                    </div>
                    <Progress
                      value={(communityPot.currentInitiative.raised / communityPot.currentInitiative.goal) * 100}
                      className="h-3 bg-rose-100"
                    />
                    <p className="text-xs text-rose-600 text-right">
                      {Math.round((communityPot.currentInitiative.raised / communityPot.currentInitiative.goal) * 100)}% funded
                    </p>
                  </div>
                </div>

                {/* Past Initiatives */}
                <div>
                  <h3 className="font-semibold text-rose-800 mb-3">Previously Funded</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {communityPot.pastInitiatives.map((initiative, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 border border-rose-100"
                      >
                        <p className="font-medium text-gray-800">{initiative.name}</p>
                        <p className="text-lg font-semibold text-rose-600">
                          £{initiative.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500">{initiative.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Token Tiers */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-6">
            Token Reward Tiers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-green-100 bg-white hover:shadow-md transition-shadow">
              <div className="h-2 bg-amber-300 rounded-t-xl"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-green-800">
                  <Shield className="h-5 w-5 text-amber-400 mr-2" />
                  Bronze Tier
                </CardTitle>
                <CardDescription>100 $FCUK Tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      1% discount on all purchases
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      Early access to seasonal products
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">Community feed badge</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {userTokens >= 100 ? (
                  <div className="w-full py-2 text-center bg-green-100 text-green-800 rounded-md">
                    Tier Unlocked
                  </div>
                ) : (
                  <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                    {100 - userTokens} More Tokens Needed
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card className="border border-green-100 bg-white hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="h-2 bg-slate-400 rounded-t-xl"></div>
              {userTier === "Silver" && (
                <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  Current Tier
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-green-800">
                  <Shield className="h-5 w-5 text-slate-400 mr-2" />
                  Silver Tier
                </CardTitle>
                <CardDescription>500 $FCUK Tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      3% discount on all purchases
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      Free delivery on orders over £25
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      Exclusive producer workshops
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      All Bronze tier benefits
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {userTokens >= 500 ? (
                  <div className="w-full py-2 text-center bg-green-100 text-green-800 rounded-md">
                    Tier Unlocked
                  </div>
                ) : (
                  <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                    {500 - userTokens} More Tokens Needed
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card className="border border-green-100 bg-white hover:shadow-md transition-shadow">
              <div className="h-2 bg-amber-500 rounded-t-xl"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-green-800">
                  <Shield className="h-5 w-5 text-amber-500 mr-2" />
                  Gold Tier
                </CardTitle>
                <CardDescription>1000 $FCUK Tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      5% discount on all purchases
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      Priority access to limited products
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      Monthly bonus tokens (25 $FCUK)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      Exclusive farm visits
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-800">
                      All Silver tier benefits
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {userTokens >= 1000 ? (
                  <div className="w-full py-2 text-center bg-green-100 text-green-800 rounded-md">
                    Tier Unlocked
                  </div>
                ) : (
                  <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                    {1000 - userTokens} More Tokens Needed
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Token Analytics */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-6">
            Your Token Analytics
          </h2>

          <Tabs defaultValue="savings" className="w-full">
            <TabsList className="bg-green-50 mb-6">
              <TabsTrigger value="savings">Fee Savings</TabsTrigger>
              <TabsTrigger value="earnings">Token Earnings</TabsTrigger>
              <TabsTrigger value="distribution">Token Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="savings" className="mt-0">
              <Card className="border border-green-100 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">
                    Monthly Fee Savings
                  </CardTitle>
                  <CardDescription>
                    Track how much you've saved with token discounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    {/* This would be a real chart in a production app */}
                    <div className="h-full w-full flex items-end justify-between gap-2 pt-10 pb-4 px-4 relative">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-green-600 py-4">
                        <span>£10</span>
                        <span>£8</span>
                        <span>£6</span>
                        <span>£4</span>
                        <span>£2</span>
                        <span>£0</span>
                      </div>

                      {/* Bars */}
                      {monthlyData.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="w-full bg-green-500 rounded-t-sm"
                            style={{ height: `${(item.savings / 10) * 100}%` }}
                          ></div>
                          <span className="mt-2 text-xs text-green-700">
                            {item.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">
                      <span className="font-medium">Total Savings:</span> £
                      {monthlyData
                        .reduce((sum, item) => sum + item.savings, 0)
                        .toFixed(2)}
                    </p>
                    <p className="text-green-800">
                      <span className="font-medium">
                        Average Monthly Savings:
                      </span>{" "}
                      £
                      {(
                        monthlyData.reduce(
                          (sum, item) => sum + item.savings,
                          0,
                        ) / monthlyData.length
                      ).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="mt-0">
              <Card className="border border-green-100 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">
                    Token Earning History
                  </CardTitle>
                  <CardDescription>
                    See how you've earned tokens over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border-b border-green-100">
                      <div>
                        <p className="font-medium text-green-800">
                          Marketplace Purchase
                        </p>
                        <p className="text-sm text-green-600">
                          Green Valley Farm - Organic Vegetables
                        </p>
                      </div>
                      <div className="flex items-center text-amber-600">
                        <Coins className="h-4 w-4 mr-1" />
                        <span>+15 $FCUK</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border-b border-green-100">
                      <div>
                        <p className="font-medium text-green-800">
                          Social Interaction
                        </p>
                        <p className="text-sm text-green-600">
                          Posted review for Oak Lane Dairy
                        </p>
                      </div>
                      <div className="flex items-center text-amber-600">
                        <Coins className="h-4 w-4 mr-1" />
                        <span>+5 $FCUK</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border-b border-green-100">
                      <div>
                        <p className="font-medium text-green-800">
                          Marketplace Purchase
                        </p>
                        <p className="text-sm text-green-600">
                          Meadow Honey - Wildflower Honey
                        </p>
                      </div>
                      <div className="flex items-center text-amber-600">
                        <Coins className="h-4 w-4 mr-1" />
                        <span>+10 $FCUK</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border-b border-green-100">
                      <div>
                        <p className="font-medium text-green-800">
                          Referral Bonus
                        </p>
                        <p className="text-sm text-green-600">
                          Friend signup: Sarah Johnson
                        </p>
                      </div>
                      <div className="flex items-center text-amber-600">
                        <Coins className="h-4 w-4 mr-1" />
                        <span>+50 $FCUK</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3">
                      <div>
                        <p className="font-medium text-green-800">
                          Marketplace Purchase
                        </p>
                        <p className="text-sm text-green-600">
                          Riverside Herbs - Fresh Herb Bundle
                        </p>
                      </div>
                      <div className="flex items-center text-amber-600">
                        <Coins className="h-4 w-4 mr-1" />
                        <span>+8 $FCUK</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution" className="mt-0">
              <Card className="border border-green-100 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">
                    $FCUK Token Distribution
                  </CardTitle>
                  <CardDescription>
                    Overview of the token economy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="aspect-square relative flex items-center justify-center">
                        {/* This would be a real pie chart in a production app */}
                        <div className="w-48 h-48 rounded-full border-8 border-green-500 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1/2 h-full bg-amber-500"></div>
                          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500"></div>
                        </div>
                        <PieChart className="absolute text-green-800 h-12 w-12 opacity-20" />
                      </div>

                      <div className="mt-6 space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 mr-2"></div>
                          <span className="text-green-800">
                            Circulating Supply (60%)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-amber-500 mr-2"></div>
                          <span className="text-green-800">
                            Liquidity Pool (20%)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                          <span className="text-green-800">Reserve (20%)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <h4 className="text-lg font-medium text-green-800 mb-4">
                        Tokenomics
                      </h4>

                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Zap className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800">
                              Fixed Supply
                            </p>
                            <p className="text-sm text-green-600">
                              1,000,000 $FCUK tokens total
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <Zap className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800">
                              Earning Mechanisms
                            </p>
                            <p className="text-sm text-green-600">
                              Purchases, reviews, referrals, and community
                              participation
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <Zap className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800">Usage</p>
                            <p className="text-sm text-green-600">
                              Discounts, exclusive access, and platform
                              governance
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <Zap className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800">
                              Sustainability
                            </p>
                            <p className="text-sm text-green-600">
                              10% of all fees go to environmental initiatives
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-6">
            How $FCUK Tokens Work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-green-100 bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Coins className="h-8 w-8 text-green-700" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-2">
                    Earn
                  </h3>
                  <p className="text-green-700">
                    Earn tokens with every purchase on the marketplace.
                    Additional tokens for reviews, referrals, and community
                    participation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-green-100 bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-green-700" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-2">
                    Unlock
                  </h3>
                  <p className="text-green-700">
                    Reach token thresholds to unlock reward tiers. Each tier
                    provides increasing benefits and discounts across the
                    platform.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-green-100 bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-green-700" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-2">
                    Save
                  </h3>
                  <p className="text-green-700">
                    Apply your token benefits automatically at checkout. Track
                    your savings and watch your benefits grow over time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <Card className="border border-green-100 bg-white">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  Do I need cryptocurrency knowledge to use $FCUK tokens?
                </h3>
                <p className="text-green-700">
                  Not at all! $FCUK tokens work seamlessly within our platform.
                  You don't need any crypto knowledge, wallets, or exchanges to
                  earn and use tokens.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-green-100 bg-white">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  How do I earn tokens?
                </h3>
                <p className="text-green-700">
                  You earn tokens through various activities: making purchases
                  in the marketplace, writing reviews, referring friends,
                  participating in the community feed, and attending events.
                  Each activity has a specific token reward.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-green-100 bg-white">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  Do tokens expire?
                </h3>
                <p className="text-green-700">
                  No, your $FCUK tokens never expire. Once earned, they remain
                  in your account until you use them. Your tier benefits are
                  applied automatically as long as you maintain the required
                  token balance.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-green-100 bg-white">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  Can I transfer tokens to other users?
                </h3>
                <p className="text-green-700">
                  Currently, tokens cannot be transferred between users. They
                  are tied to your account and the activities you perform on the
                  platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-green-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-3">
            Start Earning $FCUK Tokens Today
          </h2>
          <p className="text-green-700 max-w-2xl mx-auto mb-6">
            Make your first purchase in the marketplace and earn tokens
            instantly. The more you participate, the more you save!
          </p>
          <Link to="/marketplace">
            <Button
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg"
              size="lg"
            >
              Browse Marketplace
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TokenRewards;
