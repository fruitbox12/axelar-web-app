import React, { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import InfoWidget from "components/CompositeComponents/InfoWidget"
import PageHeader from "components/CompositeComponents/PageHeader"
import PageFooter from "components/CompositeComponents/PageFooter"
import WalkThrough from "components/CompositeComponents/Walkthrough"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import useLoadRecaptcha from "hooks/auth/useLoadRecaptcha"
import {
  ShowDisclaimer,
  ShowDisclaimerFromFAQ,
  ShowTransactionHistoryPage,
} from "state/ApplicationStatus"
import {
  ChainSelection,
  IsValidDestinationAddress,
  SourceAsset,
} from "state/ChainSelection"
import { StyledAppContainer } from "./styles/StyledAppContainer"
import SwapWindow from "pages/app/parts/swap-widget"
import { Disclaimer } from "./parts/disclaimer"
import { Redirect } from "react-router-dom"
import { TransactionHistory } from "./parts/tx-history"
import FirstTimeBadge from "components/CompositeComponents/FirstTimeBadge"
import { Mask } from "components/Widgets/Mask"
import { IsTxSubmitting } from "state/TransactionStatus"

export const AppPage = () => {
  const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha()
  const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destChainSelection = useRecoilValue(
    ChainSelection(DESTINATION_TOKEN_KEY)
  )
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const isValidDestinationAddr = useRecoilValue(IsValidDestinationAddress)
  const showDisclaimer = useRecoilValue(ShowDisclaimer)
  const showDisclaimerForFAQ = useRecoilValue(ShowDisclaimerFromFAQ)
  const showTransactionHistoryPage = useRecoilValue(ShowTransactionHistoryPage)
  const [underMaintenance] = useState(process.env.REACT_APP_UNDER_MAINTENANCE)
  const isSubmitting = useRecoilValue(IsTxSubmitting)

  const canLightUp =
    sourceChainSelection &&
    destChainSelection &&
    sourceChainSelection.chainName !== destChainSelection.chainName &&
    selectedSourceAsset &&
    isValidDestinationAddr

  useEffect(() => {
    if (!isRecaptchaSet) initiateRecaptcha()
  }, [isRecaptchaSet, initiateRecaptcha])

  if (underMaintenance === "true") return <Redirect to={"/landing"} />

  return (
    <StyledAppContainer>
      {(showDisclaimerForFAQ || canLightUp) && showDisclaimer && <Disclaimer />}
      {showTransactionHistoryPage && <TransactionHistory />}
      {process.env.REACT_APP_STAGE === "mainnet" && <FirstTimeBadge />}
      <WalkThrough />
      <InfoWidget />
      {isSubmitting && <Mask />}
      <PageHeader />
      {isRecaptchaSet && <SwapWindow />}
      <PageFooter />
    </StyledAppContainer>
  )
}
