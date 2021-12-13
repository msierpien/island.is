import React from 'react'
import { FooterItem } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './SjukratryggingarFooter.css'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { BLOCKS } from '@contentful/rich-text-types'

interface FooterProps {
  title: string
  logo?: string
  footerItems: Array<FooterItem>
}

export const SjukratryggingarFooter: React.FC<FooterProps> = ({
  title,
  logo,
  footerItems,
}) => {
  return (
    <footer aria-labelledby="organizationFooterTitle">
      <Box className={styles.footerBg} color="white" paddingTop={5}>
        <GridContainer>
          <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4]}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingBottom={4}
              marginBottom={4}
              borderColor="dark400"
              borderBottomWidth="standard"
            >
              <Box marginRight={4}>
                <img
                  src="/assets/sjukratryggingar_logo.png"
                  alt=""
                  className={styles.logoStyle}
                />
              </Box>
            </Box>
            <GridRow>
              {footerItems.slice(0, 4).map((item) => (
                <GridColumn span={['12/12', '12/12', '6/12', '3/12']}>
                  <Box>
                    <Box marginBottom={2}>
                      {richText(item.content as SliceType[])}
                    </Box>
                  </Box>
                </GridColumn>
              ))}
            </GridRow>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            paddingTop={4}
            paddingBottom={4}
            borderColor="dark400"
            borderTopWidth="standard"
          >
            <GridContainer>
              <GridRow>
                <GridColumn
                  span={['12/12', '12/12', '6/12', '3/12']}
                  className={styles.footerSecondRow}
                >
                  <img src="/assets/sjukratryggingar_norraent_samstarf.png" />
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '6/12', '3/12']}
                  className={styles.footerSecondRow}
                >
                  <img src="/assets/sjukratryggingar_heilbrigdisraduneytid.png" />
                </GridColumn>
                {footerItems.slice(4, 6).map((item) => (
                  <GridColumn
                    span={['12/12', '12/12', '6/12', '3/12']}
                    className={styles.footerSecondRow}
                  >
                    <Box>
                      {richText(item.content as SliceType[], {
                        renderNode: {
                          [BLOCKS.PARAGRAPH]: (_node, children) => (
                            <Text variant="small" color="dark400" marginY={1}>
                              {children}
                            </Text>
                          ),
                        },
                      })}
                    </Box>
                  </GridColumn>
                ))}
              </GridRow>
            </GridContainer>
          </Box>
        </GridContainer>
      </Box>
    </footer>
  )
}
