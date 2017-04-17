param (
    [string]$SubscriptionName = $(Read-Host "Enter subscription name (Press Enter for default subscription)"),
    [string]$ResourceGroupName = $(Read-Host "Enter Resource group name (Press Enter for 'NovanetNdc2017')")
)

if([string]::IsNullOrEmpty($ResourceGroupName)) { $ResourceGroupName = "NovanetNdc2017"; }
Write-Host "Resource group: "$ResourceGroupName;

Try {
  Get-AzureRmContext
} Catch {
  if ($_ -like "*Login-AzureRmAccount to login*") {
    Login-AzureRmAccount
  }
}
if($SubscriptionId) { Set-AzureRmContext -SubscriptionName $SubscriptionName; }

New-AzureRmResourceGroup -Name $ResourceGroupName -Location "North Europe"
New-AzureRmResourceGroupDeployment -Name NovanetNdcDeployment -ResourceGroupName $ResourceGroupName -TemplateFile azuredeploy.json -TemplateParameterFile parameters.json;
