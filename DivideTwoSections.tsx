import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, LinearProgress, styled } from '@mui/material';
import { AgreementView } from 'components/AgreementView';
import { Application } from 'components/CardApplication';
import {
  Profile,
  ProfileStats,
  ProfileStatsItems,
  ProfileStatsRest
} from 'components/CardProfile';
import { PsHttpError } from 'components/common/PsHttpError';
import { CommunitiesListView } from 'components/CommunitiesListView';
import { ConceptView } from 'components/ConceptView';
import { ContestsView } from 'components/ContestsView';
import Helmet from 'components/Helmet/index';
import { InventionView } from 'components/InventionView';
import { ProblemsView } from 'components/ProblemView';
import { UnlockYourRoyalties } from 'components/UnlockYourRoyalties';
import UserProfileCover from 'components/ProfileHeader/ProfileCover/UserProfileCover';
import UserProfileDetail from 'components/ProfileHeader/ProfileDetail/UserProfileDetail';
import RankingBar from 'components/RankingBar/RankingBar';
import { SolutionsView } from 'components/SolutionView';
import TabsView from 'components/TabsView';
import Config from 'config/config';
import { AuthContext } from 'contexts/AuthContext';
import { DataContext } from 'contexts/DataContext';
import ModalDataContext from 'contexts/ModalDataContext';
import { FetchError } from 'fetchUtils';
import { finalizeType } from 'helpers';
import { getIPAddress } from 'helpers/getIPAddress';
import getQueryParams from 'helpers/getQueryParams';
import { SideMenu } from 'layout';
import AgreementDocModal from 'modals/AgreementDocument/AgreementDocModal';
import {
  GetEditProfileLoader,
  GetFilePatentLoader,
  GetUser
} from 'redux-state/selectors';
import { colorPalette, useIsMediumScreen } from 'theme';
import { Constants } from 'utilities/constants';
import NotFoundPage from 'pages/error';

const HeadInfo = ({ profile }: { profile?: Profile }) => {
  if (!profile) {
    return null;
  }

  const image = (profile.files || []).find((url: any) => {
    if (url) {
      return true;
    }
  });
  const imageUrl = image ? image.url : 'assets/placeholder/profile.svg';
  const url = 'assets/profiles/' + (profile.key || profile.id);
  const title = profile.username || 'Profile';
  const description = `Create solutions with ${title} on MindMiner`;
  const keywords = (profile.tagsInfo || [])
    .map((tag: any) => tag.name)
    .join(', ');

  return (
    <header>
      <title>MindMiner - {title}</title>
      <meta name="keywords" content={keywords} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
    </header>
  );
};

const TagDetailsView = () => {
  const { id: key } = useParams();
  const conceptId = getQueryParams('id');
  const currentTab = getQueryParams('currentTab');
  const page = getQueryParams('page');
  const perPage = getQueryParams('perPage');
  const loginUser = GetUser();
  const profileEditLoader = GetEditProfileLoader();

  const isMediumScreen = useIsMediumScreen();
  const { user, loading: userLoading } = useContext(AuthContext);
  const { dataProvider } = useContext(DataContext);
  const { updateField, values } = useContext(ModalDataContext);

  const tabMapper: Record<string, number> = {
    Problems: 0,
    Solutions: 1,
    Concepts: 2,
    Inventions: 3,
    Contests: 4
  };

  const initialTab =
    currentTab && tabMapper[currentTab] ? tabMapper[currentTab] : 0;
  const [activeTab, setActiveTab] = useState<number>(initialTab);
  const [error, setError] = useState<FetchError | undefined>(undefined);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [payProductId, setPayProductId] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorPage, setShowErrorPage] = useState<boolean>(false);
  const [signedUrl, setSignedUrl] = useState<string>('');
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [statsItems, setStatsItems] = useState<ProfileStatsItems | undefined>();
  const [statsRest, setStatsRest] = useState<ProfileStatsRest | undefined>();
  const [tabs, setTabs] = useState([]);

  const [application, setApplication] = useState<Application | undefined>(
    undefined
  );
  const [archiveStatus, setArchiveStatus] = useState(false);
  const patentFileLoader = GetFilePatentLoader();

  const handleArchiveToggle = (archive) => {
    const isArchived = archive;

    if ((archiveStatus && isArchived) || (!archiveStatus && !isArchived)) {
      return;
    }
    setArchiveStatus(archive);
  };

  useEffect(() => {
    if (user && loginUser && (user.id === loginUser.id || user.isAdmin)) {
      setIsCurrentUser(true);
    }
  }, [user, loginUser]);

  const allTabs = useMemo(() => {
    const isCurrentUser = profile?.key === user?.key;

    return [
      {
        title: isCurrentUser ? Constants.MY_PROBLEMS : Constants.C_PROBLEMS,
        content: (
          <ProblemsView
            profile={profile}
            archiveStatus={archiveStatus}
            handleArchiveToggle={handleArchiveToggle}
          />
        )
      },
      {
        title: isCurrentUser ? Constants.MY_SOLUTIONS : Constants.C_SOLUTIONS,
        content: (
          <SolutionsView
            profile={profile}
            archiveStatus={archiveStatus}
            handleArchiveToggle={handleArchiveToggle}
          />
        )
      },
      {
        title: isCurrentUser ? Constants.MY_CONCEPTS : Constants.C_CONCEPTS,
        content: (
          <ConceptView
            profile={profile}
            archiveStatus={archiveStatus}
            handleArchiveToggle={handleArchiveToggle}
          />
        )
      },
      {
        title: isCurrentUser ? Constants.MY_INVENTIONS : Constants.C_INVENTIONS,
        content: (
          <InventionView
            profile={profile}
            archiveStatus={archiveStatus}
            handleArchiveToggle={handleArchiveToggle}
          />
        )
      },
      {
        title: isCurrentUser ? Constants.MY_CONTESTS : Constants.C_CONTESTS,
        content: (
          <ContestsView
            profile={profile}
            archiveStatus={archiveStatus}
            handleArchiveToggle={handleArchiveToggle}
          />
        )
      },
      {
        title: isCurrentUser ? Constants.MY_AGREEMENTS : Constants.AGREEMENTS,
        content: (
          <AgreementView
            profile={profile}
            archiveStatus={archiveStatus}
            handleArchiveToggle={handleArchiveToggle}
          />
        )
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, archiveStatus]);

  useEffect(() => {
    if (!userLoading && profile) {
      if (isCurrentUser) {
        setIsCurrentUser(true);
        setTabs(allTabs);
      } else {
        setTabs(allTabs.filter((tab) => tab.title !== 'Concepts'));
      }
    }
  }, [allTabs, isCurrentUser, profile, loginUser, userLoading]);

  const stats = useMemo(() => {
    return {
      ...statsItems,
      ...statsRest
    };
  }, [statsItems, statsRest]);

  useEffect(() => {
    if (conceptId) {
      const fetchData = async () => {
        const data = await dataProvider.getOne<Application>('applications', {
          id: conceptId as string
        });
        setApplication(data.data);
        updateField('application', data.data);
        return data;
      };

      fetchData()
        .catch((error: Error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [conceptId, dataProvider, updateField]);

  useEffect(() => {
    if (payProductId || !loginUser) return;
    dataProvider
      .getPayOptions()
      .then((list) => {
        const payProduct = list.find((item) => item.type === finalizeType.OWN);
        setPayProductId((payProduct?.id ?? '') as string);
      })
      .catch((err: Error) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dataProvider, payProductId]);

  useEffect(() => {
    if (!user || !application) return;

    const showAgreementDoc = new URLSearchParams(window.location.search)?.get(
      'showAgreementDoc'
    );

    if (showAgreementDoc) {
      setShowSuccessModal(true);
    }
  }, [application, setShowSuccessModal, user]);
  const getUserProfile = async () => {
    const { data: profileData } = await dataProvider.getOneByKey<Profile>(
      Constants.PROFILES,
      { key: key as string }
    );

    if (!profileData) setShowErrorPage(true);
    setProfile(profileData);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (patentFileLoader) return;
        setLoading(true);
        const [itemsData, restData] = await Promise.all([
          dataProvider.getProfileStats<ProfileStats>(
            { id: profile.id },
            'items'
          ),
          dataProvider.getProfileStats<ProfileStats>({ id: profile.id }, 'rest')
        ]);

        setStatsItems(itemsData.data);
        setStatsRest(restData.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, patentFileLoader]);

  const onSave = async (sign: string) => {
    setLoading(true);
    const ipAddress = await getIPAddress();

    if (sign && ipAddress) {
      const appId = values.application ? values.application.id : '';
      dataProvider
        .payOptionSign(appId, sign, ipAddress)
        .then((data) => {
          dataProvider
            .getOne<Application>('applications', { id: appId })
            .then(({ data1 = {} }: any) => {
              const paginationParams =
                page && perPage ? `&page=${page}&perPage=${perPage}` : '';
              updateField('payProducts', data1.products || []);
              setSignedUrl(data.link);
              setShowSuccessModal(false);
              window.location.href = `${Config.NEXT_PUBLIC_CLIENT_URL}${Constants.PROFILES}/${loginUser.key}?currentTab=Concepts${paginationParams}&id=${conceptId}`;
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  if (showErrorPage) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Helmet title="Profiles" />
      <HeadInfo profile={loginUser} />
      {!isMediumScreen && (
        <SideMenu active={Constants.ALL} isHomePage={false} />
      )}
      <StyledContainer>
        {profileEditLoader && <LinearProgress value={10} />}
        <StyledCardContainer>
          {loading && <LinearProgress value={10} />}
          <PsHttpError error={error} />
          {profile && !loading && tabs.length ? (
            <MainContainer isMediumScreen={isMediumScreen}>
              <StyledLeftBox isMediumScreen={isMediumScreen}>
                <UserProfileCover />
                <UserProfileDetail />
                <RankingBar isCurrentUser={isCurrentUser} />
                <TabsView
                  activeTab={activeTab}
                  archiveStatus={archiveStatus}
                  handleArchiveToggle={handleArchiveToggle}
                  setActiveTab={setActiveTab}
                  setArchiveStatus={setArchiveStatus}
                  tabs={tabs}
                />
              </StyledLeftBox>
              <StyledRightBox isMediumScreen={isMediumScreen}>
                <StyledSideBarContainer>
                  <UnlockYourRoyalties />
                  <CommunitiesListView />
                </StyledSideBarContainer>
              </StyledRightBox>
            </MainContainer>
          ) : null}
          <AgreementDocModal
            loading={loading}
            onSave={onSave}
            setLoading={setLoading}
            setShowDocModal={setShowSuccessModal}
            showDocModal={showSuccessModal}
            signedUrl={signedUrl}
            applicationId={values?.application?.id}
          />
        </StyledCardContainer>
      </StyledContainer>
    </>
  );
};

const MainContainer = styled(Grid)<{ isMediumScreen: boolean }>(
  ({ isMediumScreen }) => ({
    display: 'flex',
    flexDirection: isMediumScreen ? 'column' : 'row',
    gap: '0.9375rem',
    margin: '0 auto',
    paddingLeft: '0.625rem',
    width: '100%'
  })
);

const StyledContainer = styled(Box)({
  background: colorPalette.ashWhite,
  border: '1px solid #E8ECF0',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '0px 0px 48px 80px',
  width: '100%',
  '@media (max-width:900px)': {
    padding: '0px'
  }
});

const StyledLeftBox = styled(Box)<{ isMediumScreen: boolean }>(
  ({ isMediumScreen }) => ({
    width: isMediumScreen ? '100%' : '75%',
    overflowX: 'hidden'
  })
);

const StyledRightBox = styled(Box)<{ isMediumScreen: boolean }>(
  ({ isMediumScreen }) => ({
    width: isMediumScreen ? '100%' : '25%'
  })
);

